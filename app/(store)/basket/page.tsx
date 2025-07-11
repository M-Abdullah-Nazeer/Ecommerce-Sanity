"use client";

import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import useBasketStore from "../store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import AddtoBasketButton from "@/components/AddtoBasketButton";
import { createCheckoutSession, Metadata } from "@/actions/createCheckoutSession";





function BasketPage() {
    const groupedItem = useBasketStore((state) => state.getGroupedItems());
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    // wait for client to mount

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <Loader />;
    }

    if (groupedItem.length === 0) {
        return (
            <div className="container flex flex-col justify-center items-center min-h-[50vh]">

                <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
                <p className="text-lg text-gray-600">Your cart is empty</p>
            </div>
        );
    }


    const handleCheckout = async () => {
        if (!isSignedIn) return;
        setIsLoading(true);

        try {

            const metadata: Metadata = {
                orderNumber: crypto.randomUUID(),
                customerName: user?.fullName ?? "Unknown",
                customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
                clerkUserId: user!.id,
            }

            const checkoutUrl = await createCheckoutSession(groupedItem, metadata);

            if(checkoutUrl){
                window.location.href  = checkoutUrl;
            }

        } catch (error) {
            console.error("Error creating checkout session",error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">

            <h2 className="text-2xl font-bold mb-4"> Your Cart</h2>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow">
                    {groupedItem?.map((item) => (
                        <div className="mb-4 p-4 border rounded flex items-center justify-between"
                            key={item.product._id}
                        >

                            <div className="flex items-center cursor-pointer flex-1 min-w-0"
                                onClick={() =>
                                    router.push(`/product/${item.product.slug?.current}`)
                                }
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-0">

                                    {item.product.image && (
                                        <Image src={imageUrl(item.product.image).url()}
                                            alt={item.product.name ?? "Ecomerce MAN"}
                                            className="w-full h-full object-cover rounded"
                                            width={96}
                                            height={96}
                                        />
                                    )}

                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg sm:text-xl font-semibold truncate">{item.product.name}</h2>
                                    <p className="text-sm sm:text-base">
                                        Price: $ {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center ml-4 flex-shrink-0">
                                <AddtoBasketButton product={item.product} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">

                    <h3 className="text-xl font-semibold">Order Summary</h3>
                    <div className="mt-4 space-y-2">
                        <p className="flex justify-between">
                            <span>Items:</span>
                            <span>
                                {groupedItem.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                        </p>
                        <p className="flex justify-between text-2xl font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>
                                ${useBasketStore.getState().getTotalPrice().toFixed(2)}
                            </span>
                        </p>
                    </div>

                    {isSignedIn ? (

                        <button onClick={handleCheckout}
                            disabled={isLoading}
                            className="mt-4 w-full bg-maincol text-white px-4 py-2 rounded hover:bg-hovercol disabled:bg-gray-400"
                        >
                            {isLoading ? "Processing..." : "Checkout"}
                        </button>

                    ) : (

                        <SignInButton mode="modal">
                            <button 
                               
                                className="mt-4 w-full bg-maincol text-white px-4 py-2 rounded hover:bg-hovercol"
                            >
                                Sign in to Checkout
                            </button>
                        </SignInButton>

                    )}
                </div>

                <div className="h-64 lg:h-0">
                    {/* {spaceer for fixed checkout on mobiles} */}
                </div>

            </div>

        </div>
    )

}
export default BasketPage;