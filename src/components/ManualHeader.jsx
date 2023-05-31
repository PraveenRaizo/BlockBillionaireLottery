import { useMoralis } from "react-moralis"
import { useEffect } from "react"


function ManualHeader(){


    const {enableWeb3, account, isWeb3Enabled, Moralis, isWeb3EnableLoading} = useMoralis() // hook - its a way to keep track of states in our applications
    // moralis takes care of window.ethereum stuff while we click the button
    
    //even if we refresh the page our wallet will be connected. But for our frontend to reflect this we are using useEffect

    useEffect(() => {
        if(isWeb3Enabled)
            return console.log("This is useEffect:",isWeb3Enabled)
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem("connected")){
                enableWeb3()
            }
        }
        console.log("Hi! This is useeffect!")
        console.log(isWeb3Enabled)
    }, [isWeb3Enabled])

    useEffect(()=>{
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if(account == null) {
                window.localStorage.removeItem("connected") 
                Moralis.deactivateWeb3() //  sets isWeb3Enabled to false
                console.log("Null account found")
            }
        })
    }, [])

    return (
            <nav className="p-5 border b-2">
                <ul className="">
                    <li className="flex flex-row">
                    { account ? (
                            <div className="ml-auto py-2 px-4 bg-blue-500 text-white rounded ml-auto">
                                Connected to {account.slice(0,4)}..{account.slice(account.length-4)} 
                            </div>
                            ) : (
                            <button 
                                onClick={ async ()=>{
                                    await enableWeb3()
                                    if(typeof window !== "undefined")
                                        window.localStorage.setItem("connected", "injected")
                                }} 
                                disabled = {isWeb3EnableLoading}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            >
                                Connect Wallet
                            </button>)
                        }
                    </li>
                </ul>
            </nav>
    )
}

export default ManualHeader;

