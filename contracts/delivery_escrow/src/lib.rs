#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, token};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Delivery(u64), // Delivery ID -> Delivery
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Delivery {
    pub sponsor: Address,
    pub courier: Address,
    pub amount: i128,
    pub token: Address,
    pub is_completed: bool,
}

#[contract]
pub struct DeliveryEscrow;

#[contractimpl]
impl DeliveryEscrow {
    /// Creates a new delivery escrow.
    /// The sponsor must authorize this call and have sufficient token allowance.
    pub fn create_delivery(
        env: Env,
        delivery_id: u64,
        sponsor: Address,
        courier: Address,
        token: Address,
        amount: i128,
    ) {
        sponsor.require_auth();

        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let key = DataKey::Delivery(delivery_id);
        if env.storage().persistent().has(&key) {
            panic!("Delivery ID already exists");
        }

        // Transfer tokens from sponsor to the contract
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sponsor, &env.current_contract_address(), &amount);

        let delivery = Delivery {
            sponsor,
            courier,
            amount,
            token,
            is_completed: false,
        };

        env.storage().persistent().set(&key, &delivery);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "DeliveryCreated"), delivery_id),
            delivery,
        );
    }

    /// Completes a delivery and releases the funds to the courier.
    /// The sponsor must authorize this call to confirm the delivery is complete.
    pub fn complete_delivery(env: Env, delivery_id: u64) {
        let key = DataKey::Delivery(delivery_id);
        let mut delivery: Delivery = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("Delivery not found"));

        if delivery.is_completed {
            panic!("Delivery already completed");
        }

        // Sponsor must authorize the completion
        delivery.sponsor.require_auth();

        delivery.is_completed = true;
        env.storage().persistent().set(&key, &delivery);

        // Transfer tokens from contract to courier
        let token_client = token::Client::new(&env, &delivery.token);
        token_client.transfer(&env.current_contract_address(), &delivery.courier, &delivery.amount);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "DeliveryCompleted"), delivery_id),
            delivery,
        );
    }

    /// Gets the details of a delivery.
    pub fn get_delivery(env: Env, delivery_id: u64) -> Delivery {
        let key = DataKey::Delivery(delivery_id);
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("Delivery not found"))
    }
}

#[cfg(test)]
mod test;
