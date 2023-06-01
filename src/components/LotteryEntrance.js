import { useWeb3Contract } from "react-moralis"
import {abi, contractAddresses} from "../constants"
import {useMoralis} from "react-moralis"
import { useEffect, useState } from "react"
import {ethers} from "ethers"
import { useNotification } from "web3uikit"


export default function LotteryEntrance(){

    const {Moralis, isWeb3Enabled, chainId: chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    console.log(chainId)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0]:null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch =  useNotification()

    const {
        runContractFunction : enterRaffle,
        data : enterTxResponse,
        isLoading,
        isFetching
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, 
        functionName: "enterRaffle",
        params: {},
        msgValue : entranceFee
    })

    const {runContractFunction : getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, 
        functionName: "getEntranceFee",
        params: {}
    })

    const {runContractFunction : getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, 
        functionName: "getNumberOfPlayers",
        params: {}
    })

    const {runContractFunction : getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, 
        functionName: "getRecentWinner",
        params: {}
    })

    async function updateUI(){
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(()=>{
        if(isWeb3Enabled){
            // try to read the raffle entrance fee
            
            updateUI()
        }
    },[isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        
        handleNewNotification(tx)
        updateUI()
    }


    //handle new notification
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div>
            {
                raffleAddress ? (
                    <div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={ async () => 
                            await enterRaffle({
                                onSuccess : handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        } disabled = {isLoading || isFetching}
                        >
                            Enter Raffle!
                        </button>
                        <div>
                            Enterance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                        </div>
                        <div>
                            Number of Players: {numPlayers}
                        </div>
                        <div>
                            Recent Winner: {recentWinner}
                         </div>
                    </div>  
                ) : (
                <div> No Raffle contract!!!</div>
                )
            }
        </div>
    )
}