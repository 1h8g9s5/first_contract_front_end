import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";

export function useMainContract() {
    const client = useTonClient();

    const [contractData, setContractData] = useState < null | 
        {
            counter_value: number;
            recent_sender: Address;   // latest sender address written by contract FunC
            owner: Address;
        }>();

    const [contractBalance, setContractBalance] = useState < null | number >(0);
    
    const mainContract = useAsyncInitialize(async() => {
        if (!client) return;
        const contract = new MainContract(
            Address.parse("EQA0anXDMQCgoe5-vehL57Sb1ECFU57gdSXjcAic0aqbzxR8")    //deployed chapt.4 with blueprint
        ); 
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect( () => {
        async function getValue() {
            if (!mainContract) return;
            setContractData(null);
            const val = await mainContract.getData();
            const { balance } = await mainContract.getBalance();
            setContractData({
                counter_value: val.counter_number,
                recent_sender: val.sender_address,
                owner: val.owner_address
            });
            setContractBalance(balance);
        }
        getValue();
    }, [mainContract]);

    return {
        contract_address: mainContract?.address.toString(),
        contract_balance: contractBalance,
        ...contractData
    }
}