"use client"

import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import useBasketStore from "@/app/(store)/store";

function Header() {

    const { isLoaded, isSignedIn, user } = useUser();
    
    const itemCount = useBasketStore((state)=>
    state.items.reduce((total, item)=> total + item.quantity, 0)
    );

    const createClerkPasskey = async()=>{

        try {
            
            const response = await user?.createPasskey();
            console.log(response);

        } catch (error) {
            console.error("Error:", JSON.stringify(error, null, 2 ));
        }
    };

    return (
        <header className="flex flex-wrap justify-between items-center px-4 py-2">


            {/* {top} */}

            <div className="flex flex-wrap w-full justify-between items-center">
                <Link className="text-2xl font-bold text-maincol
    hover:opacity-50 cursor-pointer mx-auto sm:mx-0" href="/">
                    MAN
                </Link>




                <Form action="/search" className="w-full sm:auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0">
                    <input className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-maincol focus:ring-opacity-50 border w-full max-w-4xl" placeholder="Search for products" name="query" type="text" />


                </Form>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 md:flex-none">

                    <Link href="/basket"
                        className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-maincol hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >

                        <TrolleyIcon className="w-6 h-6" />
<span className="absolute -top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
    {itemCount}
</span>

                        <span>Cart</span>

                    </Link>


                    {/* {user area} */}

                    <ClerkLoaded>

                        {isSignedIn && (
                            <Link href="/orders"
                                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-maincol hover:bg-hovercol text-white font-bold py-2 px-4 rounded"
                            >

                                <PackageIcon className="w-6 h-6" />
                                <span>My Orders</span>

                            </Link>
                        )}

                        {isSignedIn ? (

                            <div className="flex items-center space-x-2">

                                <UserButton />

                                <div className="hidden sm:block text-xs">

                                    <p className="text-gray-400">Welcome Back</p>
                                    <p className="font-bold">{user.fullName}!</p>
                                </div>

                            </div>
                        ) : (
                            <SignInButton mode="modal" />
                        )}


                        {user?.passkeys.length === 0 && (
                            <button onClick={createClerkPasskey}
                                className="bg-white hover:bg-hovercol hover:text-white animate-pulse text-maincol font-bold py-2 px-4 rounded border-blue-300 border"
                            >
                                Create passkey
                            </button>
                        )}

                    </ClerkLoaded>


                </div>

            </div>


        </header>
    )
}

export default Header