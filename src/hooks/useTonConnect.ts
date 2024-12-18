import { useTonConnectUI } from "@tonconnect/ui-react"
import { SenderArguments } from "@ton/core"

export function useTonConnect () {
    const [tonConnectUI] = useTonConnectUI();

    return {
        sender: {
            send: async (args: SenderArguments) => {
                tonConnectUI.sendTransaction({
                    messages: [{
                        address: args.to.toString(),
                        amount: args.value.toString(),
                        payload: args.body?.toBoc().toString('base64')
                    }],
                    validUntil: Date.now() + 5 *60*1000, // 5 minutes real world time for user confirmation
                });
            } 
        },
        connected: tonConnectUI.connected
    };
}