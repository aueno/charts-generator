"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { atom, useAtom } from "jotai";
export const textAreaAtom = atom("");


export default function InputForm() {

    const [textArea, setTextArea] = useAtom(textAreaAtom);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (!content) return;
            setTextArea(String(content));
        };
        reader.readAsText(file, "Shift_JIS");
    };
    

    return (
        <>
            <div className="grid w-full gap-1.5">
                <label>データセット入力</label>
                <Textarea
                    className="w-90"
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    rows={5}
                />
                <p className="text-sm text-muted-foreground">
                データを変量間はカンマ区切り，データ間は改行で入力してください．
                </p>
                <br />
            </div>
            <div>
                <label>データインポート（CSV,text[UTF-8]）</label>
                <Input
                    className="w-90"
                    type="file"
                    accept="text/csv,text/plain"
                    onChange={handleFileUpload}
                />
            </div>
            <br />
        </>
    );
}