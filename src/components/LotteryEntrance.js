import { useWeb3Contract } from "react-moralis"
import {abi, contractAddresses} from "../constants"
import {useMoralis} from "react-moralis"
import { useEffect, useState } from "react"
import {ethers} from "ethers"


export default function LotteryEntrance(){

    const {Moralis, isWeb3Enabled, chainId: chainIdHex} = useMoralis()
    const chainId = parseInt(chainIdHex)
    console.log(chainId)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0]:null

    const [entranceFee, setEntranceFee] = useState("0")

    // const {runContractFunction : enterRaffle} = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: raffleAddress, 
    //     functionName: "enterRaffle",
    //     params: {},
    //     msgValue: 
    // })

    const {runContractFunction : getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, 
        functionName: "getEntranceFee",
        params: {},
        msgValue: ""
    })

    useEffect(()=>{
        if(isWeb3Enabled){
            // try to read the raffle entrance fee
            async function updateUI(){
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                setEntranceFee(entranceFeeFromCall)
            }
            updateUI()
        }
    },[isWeb3Enabled])

    return (
        <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
    )
}