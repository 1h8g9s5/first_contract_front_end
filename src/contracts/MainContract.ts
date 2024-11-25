import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";


export type MainContractConfig = {
    number: number;
    init_address: Address;
    owner_address: Address;
}

export function mainContractConfigToCell (config: MainContractConfig): Cell {
    return beginCell()
        .storeUint(config.number, 32)
        .storeAddress(config.init_address)
        .storeAddress(config.owner_address)
        .endCell();
}

export class MainContract implements Contract {
    constructor (
        readonly address: Address,
        readonly init?: {code: Cell, data: Cell}
    ) {}

    static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0) {
        const data = mainContractConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);

        return new MainContract(address, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).endCell(),
        });
    }

    async sendIncrement(provider: ContractProvider, sender: Sender, value: bigint, increment_by: number) {
        // sending message with increment info 
        const msg_body = beginCell()
            .storeUint(1, 32)  // op code written in contract
            .storeUint(increment_by, 32)  // increment number input when calling function
        .endCell();

        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
        // deposit op code from contract FunC
        const msg_body = beginCell()
            .storeUint(2, 32)  // op code written in contract
        .endCell();

        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async sendDepositWrongOP(provider: ContractProvider, sender: Sender, value: bigint) {
        // deposit op code from contract FunC
        const msg_body = beginCell()
            .storeUint(55, 32)  // random wrong op code for deposit (correct: 2)
        .endCell();

        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async sendWithdrawRequest(provider: ContractProvider, sender: Sender, value: bigint, withdraw_amount: bigint) {
        // withdraw op code from contract FunC
        const msg_body = beginCell()
            .storeUint(3, 32)  // op 3 for withdraw
            .storeCoins(withdraw_amount)  // in contract, withdraw amount is read after op
        .endCell();

        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_contract_storage_data", [])

        return {
            counter_number: stack.readNumber(),
            sender_address: stack.readAddress(),
            owner_address: stack.readAddress()
        }
    }

    async getBalance(provider: ContractProvider) {
        const { stack } = await provider.get("get_contract_balance", [])

        return {
            balance: stack.readNumber()
        }
    }
}