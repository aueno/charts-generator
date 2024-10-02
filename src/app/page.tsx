"use client";

import Image from "next/image"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"

import Histogram from "./components/histogram";
import Ca from "./components/ca";
import Ra from "./components/ra";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";


export default function DashboardPage() {

    const router = useRouter();

    return (
        <>
            {/* <div className="md:hidden">
                <Image
                    src="/examples/dashboard-light.png"
                    width={1280}
                    height={866}
                    alt="Dashboard"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/dashboard-dark.png"
                    width={1280}
                    height={866}
                    alt="Dashboard"
                    className="hidden dark:block"
                />
            </div> */}
            <div className="flex-col md:flex">
                
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">統 計 解 析 シ ス テ ム</h2>
                        <h3 className="text-2xl font-semibold tracking-tight">Statistical Analysis System</h3>
                        <div className="flex items-center space-x-2">
                            {/* <Button>Button</Button> */}
                        </div>
                        <hr />
                    </div>
                    <Tabs defaultValue="Histogram" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="Histogram">
                            度数分布・ヒストグラム
                            </TabsTrigger>
                            <TabsTrigger value="Ca">
                             散布図・相関分析
                            </TabsTrigger>
                            <TabsTrigger value="Ra">
                             回帰分析（線形近似）
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="Histogram" className="space-y-4">
                            <div className="">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>ヒストグラム作成</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Histogram />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="Ca" className="space-y-4">
                            <div className="">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>相関分析</CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <Ca />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="Ra" className="space-y-4">
                            <div className="">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>回帰分析（線形近似）</CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        <Ra />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>

                </div>
            </div>
        </>
    )
}