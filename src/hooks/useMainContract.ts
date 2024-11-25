import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano, fromNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
    const client = useTonClient();
    const { sender } = useTonConnect();

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const [contractData, setContractData] = useState < null | 
        {
            counter_value: number;
            recent_sender: Address;   // latest sender address written by contract FunC
            owner_address: Address;
        }>();

    const [contractBalance, setContractBalance] = useState < null | number >(0);
    
    const mainContract = useAsyncInitialize(async() => {
        if (!client) return;
        const contract = new MainContract(
            Address.parse("EQA0anXDMQCgoe5-vehL57Sb1ECFU57gdSXjcAic0aqbzxR8")    //deployed chapt.4 with blueprint
        ); 
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    const [incrementValue, setIncrementValue] = useState(1);
    const updateIncrementValue = (newValue: number) => {
        setIncrementValue(newValue);
    };

    const sendIncrement = () => { 
        return mainContract?.sendIncrement(sender, toNano("0.05"), incrementValue);   // set increment_by via UI
    };

    const sendDeposit = () => { 
        return mainContract?.sendDeposit(sender, toNano("1"));   // set 1 TON deposit
    };

    const sendWitdrawRequest = () => { 
        return mainContract?.sendWithdrawRequest(
            sender,
            toNano("0.05"),     // transanction fee
            toNano("1")       // withdraw 1 TON
        ); 
    };

    useEffect( () => {
        async function getValue() {
            if (!mainContract) return;
            setContractData(null);
            const val = await mainContract.getData();
            const { balance } = await mainContract.getBalance();
            setContractData({
                counter_value: val.counter_number,
                recent_sender: val.sender_address,
                owner_address: val.owner_address
            });
            setContractBalance(balance);

            // sleep 5 seconds and poll value again
            await sleep(5000); 
            getValue();
        }
        getValue();
    }, [mainContract]);

    return {
        contract_address: mainContract?.address,
        contract_balance: fromNano((contractBalance ?? 0).toString()),  // checking undefined contractBalance
        ...contractData,
        incrementValue,
        updateIncrementValue,
        sendIncrement,
        sendDeposit,
        sendWitdrawRequest
    }
}