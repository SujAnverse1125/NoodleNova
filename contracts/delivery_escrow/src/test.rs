#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient as TokenAdminClient;

fn create_token_contract<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let contract_address = env.register_stellar_asset_contract(admin.clone());
    (
        TokenClient::new(env, &contract_address),
        TokenAdminClient::new(env, &contract_address),
    )
}

#[test]
fn test_delivery_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, DeliveryEscrow);
    let client = DeliveryEscrowClient::new(&env, &contract_id);

    let sponsor = Address::generate(&env);
    let courier = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    // Mint some tokens to the sponsor
    token_admin_client.mint(&sponsor, &1000);
    assert_eq!(token.balance(&sponsor), 1000);

    let delivery_id = 1;
    let amount = 100;

    // Create delivery
    client.create_delivery(&delivery_id, &sponsor, &courier, &token.address, &amount);

    // Verify balances after creation
    assert_eq!(token.balance(&sponsor), 900);
    assert_eq!(token.balance(&contract_id), 100);

    // Verify delivery state
    let delivery = client.get_delivery(&delivery_id);
    assert_eq!(delivery.sponsor, sponsor);
    assert_eq!(delivery.courier, courier);
    assert_eq!(delivery.amount, amount);
    assert_eq!(delivery.token, token.address);
    assert_eq!(delivery.is_completed, false);

    // Complete delivery
    client.complete_delivery(&delivery_id);

    // Verify balances after completion
    assert_eq!(token.balance(&contract_id), 0);
    assert_eq!(token.balance(&courier), 100);

    // Verify delivery state
    let delivery = client.get_delivery(&delivery_id);
    assert_eq!(delivery.is_completed, true);
}

#[test]
#[should_panic(expected = "Delivery ID already exists")]
fn test_duplicate_delivery_id() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, DeliveryEscrow);
    let client = DeliveryEscrowClient::new(&env, &contract_id);

    let sponsor = Address::generate(&env);
    let courier = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token, token_admin_client) = create_token_contract(&env, &token_admin);
    token_admin_client.mint(&sponsor, &1000);

    let delivery_id = 1;
    let amount = 100;

    client.create_delivery(&delivery_id, &sponsor, &courier, &token.address, &amount);
    
    // This should panic
    client.create_delivery(&delivery_id, &sponsor, &courier, &token.address, &amount);
}

#[test]
#[should_panic(expected = "Delivery already completed")]
fn test_double_complete() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, DeliveryEscrow);
    let client = DeliveryEscrowClient::new(&env, &contract_id);

    let sponsor = Address::generate(&env);
    let courier = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let (token, token_admin_client) = create_token_contract(&env, &token_admin);
    token_admin_client.mint(&sponsor, &1000);

    let delivery_id = 1;
    let amount = 100;

    client.create_delivery(&delivery_id, &sponsor, &courier, &token.address, &amount);
    client.complete_delivery(&delivery_id);
    
    // This should panic
    client.complete_delivery(&delivery_id);
}
