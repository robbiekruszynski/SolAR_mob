use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, create_master_edition_v3, CreateMetadataAccountsV3,
        CreateMasterEditionV3, Metadata,
    },
    token::{Mint, Token, TokenAccount},
};
use mpl_token_metadata::types::{Creator, DataV2};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod treasure_hunt {
    use super::*;

    pub fn initialize_treasure(
        ctx: Context<InitializeTreasure>,
        treasure_name: String,
        treasure_symbol: String,
        treasure_uri: String,
        location_lat: f64,
        location_lng: f64,
        bonk_reward: u64,
    ) -> Result<()> {
        let treasure = &mut ctx.accounts.treasure;
        treasure.authority = ctx.accounts.authority.key();
        treasure.mint = ctx.accounts.mint.key();
        treasure.treasure_name = treasure_name;
        treasure.treasure_symbol = treasure_symbol;
        treasure.treasure_uri = treasure_uri;
        treasure.location_lat = location_lat;
        treasure.location_lng = location_lng;
        treasure.bonk_reward = bonk_reward;
        treasure.is_found = false;
        treasure.finder = Pubkey::default();
        treasure.found_at = 0;

        // Create metadata
        let creator = Creator {
            address: ctx.accounts.authority.key(),
            verified: false,
            share: 100,
        };

        let data_v2 = DataV2 {
            name: treasure.treasure_name.clone(),
            symbol: treasure.treasure_symbol.clone(),
            uri: treasure.treasure_uri.clone(),
            seller_fee_basis_points: 500, // 5%
            creators: Some(vec![creator]),
            collection: None,
            uses: None,
        };

        let creator_key = ctx.accounts.authority.key();
        let mint_key = ctx.accounts.mint.key();
        let metadata_seeds = &[
            b"metadata",
            mpl_token_metadata::ID.as_ref(),
            mint_key.as_ref(),
        ];
        let (metadata_account, _bump) = Pubkey::find_program_address(metadata_seeds, &mpl_token_metadata::ID);

        let master_edition_seeds = &[
            b"metadata",
            mpl_token_metadata::ID.as_ref(),
            mint_key.as_ref(),
            b"edition",
        ];
        let (master_edition_account, _bump) = Pubkey::find_program_address(master_edition_seeds, &mpl_token_metadata::ID);

        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    mint_authority: ctx.accounts.authority.to_account_info(),
                    payer: ctx.accounts.authority.to_account_info(),
                    update_authority: ctx.accounts.authority.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            data_v2,
            true,
            true,
            None,
            None,
            None,
        )?;

        create_master_edition_v3(
            CpiContext::new(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMasterEditionV3 {
                    edition: ctx.accounts.master_edition.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    update_authority: ctx.accounts.authority.to_account_info(),
                    mint_authority: ctx.accounts.authority.to_account_info(),
                    payer: ctx.accounts.authority.to_account_info(),
                    metadata: ctx.accounts.metadata.to_account_info(),
                    token_program: ctx.accounts.token_program.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            Some(0), // Max supply of 0 means unlimited
        )?;

        Ok(())
    }

    pub fn discover_treasure(ctx: Context<DiscoverTreasure>) -> Result<()> {
        let treasure = &mut ctx.accounts.treasure;
        let clock = Clock::get()?;

        require!(!treasure.is_found, TreasureHuntError::TreasureAlreadyFound);
        
        // Verify location (simplified - in real app you'd check GPS coordinates)
        // For now, we'll just mark it as found
        
        treasure.is_found = true;
        treasure.finder = ctx.accounts.finder.key();
        treasure.found_at = clock.unix_timestamp;

        // Mint NFT to finder
        let cpi_accounts = anchor_spl::token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.finder_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::token::mint_to(cpi_ctx, 1)?;

        // Transfer BONK reward (if any)
        if treasure.bonk_reward > 0 {
            // In a real implementation, you'd transfer BONK tokens here
            // For now, we'll just log the reward
            msg!("BONK reward: {}", treasure.bonk_reward);
        }

        msg!("Treasure discovered! NFT minted to finder.");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTreasure<'info> {
    #[account(
        init,
        payer = authority,
        space = Treasure::LEN
    )]
    pub treasure: Account<'info, Treasure>,
    
    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = authority,
    )]
    pub mint: Account<'info, Mint>,
    
    /// CHECK: This is the metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    
    /// CHECK: This is the master edition account
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DiscoverTreasure<'info> {
    #[account(mut)]
    pub treasure: Account<'info, Treasure>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(
        init_if_needed,
        payer = finder,
        associated_token::mint = mint,
        associated_token::authority = finder,
    )]
    pub finder_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub finder: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct Treasure {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub treasure_name: String,
    pub treasure_symbol: String,
    pub treasure_uri: String,
    pub location_lat: f64,
    pub location_lng: f64,
    pub bonk_reward: u64,
    pub is_found: bool,
    pub finder: Pubkey,
    pub found_at: i64,
}

impl Treasure {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // mint
        4 + 50 + // treasure_name (String)
        4 + 10 + // treasure_symbol (String)
        4 + 200 + // treasure_uri (String)
        8 + // location_lat (f64)
        8 + // location_lng (f64)
        8 + // bonk_reward (u64)
        1 + // is_found (bool)
        32 + // finder (Pubkey)
        8; // found_at (i64)
}

#[error_code]
pub enum TreasureHuntError {
    #[msg("Treasure has already been found")]
    TreasureAlreadyFound,
    #[msg("Invalid location")]
    InvalidLocation,
} 