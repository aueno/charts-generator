"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';


export default function Howto() {


    return (
        <>

            <Card>
                <CardHeader>
                    <CardTitle>１．データの準備</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>CSVデータを<b>UTF-8で</b>ご準備ください．</p>
                    <p>以下は，CSVデータの例（共通テスト得点のダミーデータ）です．</p>
                    <br />
                    <Textarea
                        value={`国語,地歴公民,数学１,数学２,理科,外国語,情報,合計
165,68,67,75,84,123,78,660
117,69,81,81,65,115,57,585
102,52,55,56,93,152,79,589
160,91,62,68,61,144,98,684
154,57,67,63,60,167,53,621
167,57,87,68,59,192,68,698
197,57,87,84,92,189,74,780
182,66,81,88,79,106,99,701
169,97,83,96,79,103,58,685
`}
                        rows={10}
                    />
                    <br />
                    <p>１行目に変量名（列名）を入力することで，軸ラベルなどに自動で反映されます．<br/>
                    （これを省略し，１行目からデータのみを入力することも可能ですが，利便性の観点から１行目に変量名（列名）を入力することを推奨します．）</p>
                    <br />
                    <p>１行目以外に数値以外のデータ（文字，記号 など）が入力されるとエラーになります．</p>
                    <br />
                    <p>また，変量間はカンマ区切りだけでなく空白区切りでも識別されるため，
                        変量間を区切る以外の空白がデータに存在する場合は取り除いてください．</p>
                    <br />
                    <p>データの準備ができたら，画面上部の「データ入力フォーム」にCSVデータを貼り付けまたはアップロードしてください．</p>
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardHeader>
                    <CardTitle>２．免責事項</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>当アプリの開発に際して，解析出力結果の検証など細心の注意を払っておりますが，解析結果の完全性及び正確性を保証するものではありません．</p>
                    <p>当アプリを利用したことに起因するいかなる損害についても，一切の責任を負いかねます．</p>
                    <p>当アプリの利用は，利用者自身の責任において行ってください．</p>
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardHeader>
                    <CardTitle>３．ソースコード</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>当アプリのソースコードは，GitHubで公開しております．</p>
                    <p>リポジトリURL：<a href="https://github.com/aueno/charts-generator">https://github.com/aueno/charts-generator</a></p>
                    <br />
                </CardContent>
            </Card>
        </>
    );
}
