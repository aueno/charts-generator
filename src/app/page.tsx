"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Histogram from "./components/histogram";

export default function Home() {

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>ヒストグラムジェネレータ</CardTitle>
        </CardHeader>
        <CardContent>
          <Histogram />
        </CardContent>
      </Card>
    </>
  );
}