"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAtom } from "jotai";
import { textAreaAtom } from "./input";

export default function Sql() {
    useEffect(() => {
        AOS.init();
    }, []);

    const [textArea] = useAtom(textAreaAtom);
    const [insertquery, setInsertQuery] = useState("");
    const [tableNamequote, setTableNameQuote] = useState("None");
    const [columnNamequote, setColumnNameQuote] = useState("None");
    const [valueQuote, setValueQuote] = useState("None");
    const [tableName, setTableName] = useState("");

    // CSVデータをINSERT文に変換
    useEffect(() => {
        if (textArea === "") {
            setInsertQuery("");
            return;
        }
        let lines = textArea.split("\n");
        let columns = lines[0].split(",");
        let values = lines.slice(1).map((line) => line.split(","));
        let insertquery = "INSERT INTO ";
        if (tableNamequote === "バッククォート") {
            insertquery += "`" + tableName + "`";
        } else if (tableNamequote === "ダブルクォート") {
            insertquery += "\"" + tableName + "\"";
        } else if (tableNamequote === "角括弧") {
            insertquery += "[" + tableName + "]";
        } else {
            insertquery += tableName;
        }
        insertquery += " (";
        for (let i = 0; i < columns.length; i++) {
            if (columnNamequote === "バッククォート") {
                insertquery += "`" + columns[i] + "`";
            } else if (columnNamequote === "ダブルクォート") {
                insertquery += "\"" + columns[i] + "\"";
            } else if (columnNamequote === "角括弧") {
                insertquery += "[" + columns[i] + "]";
            } else {
                insertquery += columns[i];
            }
            if (i < columns.length - 1) {
                insertquery += ", ";
            }
        }
        insertquery += ") \n VALUES \n ";
        for (let i = 0; i < values.length; i++) {
            insertquery += "(";
            for (let j = 0; j < values[i].length; j++) {
                if (valueQuote === "シングルクォート") {
                    insertquery += "'" + values[i][j] + "'";
                } else if (valueQuote === "ダブルクォート") {
                    insertquery += "\"" + values[i][j] + "\"";
                } else if (valueQuote === "バッククォート") {
                    insertquery += "`" + values[i][j] + "`";
                } else {
                    insertquery += values[i][j];
                }
                if (j < values[i].length - 1) {
                    insertquery += ", ";
                }
            }
            insertquery += ")";
            if (i < values.length - 1) {
                insertquery += ", \n";
            } else {
                insertquery += ";";
            }
        }
        setInsertQuery(insertquery);
    }, [textArea, tableName, tableNamequote, columnNamequote, valueQuote]);

    return (
        <div>
            <br />
            <p>フォームに入力されたCSVをSQLのINSERT文に変換します．</p>
            <br />
            <div>
                <label>テーブル名</label>
                <Input
                    className="w-90"
                    value={tableName}
                    placeholder="users"
                    onChange={(e) => setTableName(e.target.value)}
                />
            </div>
            <br />
            <div>
                <label>テーブル名のクォート</label>
                <Select onValueChange={(v) => setTableNameQuote(v)}>
                    <SelectTrigger className="max-w-md">
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="なし">なし</SelectItem>
                        <SelectItem value="バッククォート">バッククォート</SelectItem>
                        <SelectItem value="ダブルクォート">ダブルクォート</SelectItem>
                        <SelectItem value="角括弧">角括弧</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <br />
            <div>
                <label>カラム名のクォート</label>
                <Select onValueChange={(v) => setColumnNameQuote(v)}>
                    <SelectTrigger className="max-w-md">
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="なし">なし</SelectItem>
                        <SelectItem value="バッククォート">バッククォート</SelectItem>
                        <SelectItem value="ダブルクォート">ダブルクォート</SelectItem>
                        <SelectItem value="角括弧">角括弧</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <br />
            <div>
                <label>VALUESのクォート</label>
                <Select onValueChange={(v) => setValueQuote(v)}>
                    <SelectTrigger className="max-w-md">
                        <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="なし">なし</SelectItem>
                        <SelectItem value="シングルクォート">シングルクォート</SelectItem>
                        <SelectItem value="ダブルクォート">ダブルクォート</SelectItem>
                        <SelectItem value="バッククォート">バッククォート</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <br />
            <div>
                <label>クエリ 生成結果</label>
                <Textarea
                    className="max-w-4xl h-64"
                    value={insertquery}
                    readOnly
                />
            </div>
            <br />
            <p> &nbsp; </p>
        </div>
    );
}
