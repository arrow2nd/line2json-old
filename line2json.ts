import { basename } from "https://deno.land/std@0.106.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.106.0/flags/mod.ts";

type TalkData = {
  date: string;
  username: string;
  message: string;
};

const dateRegexp = /^\d{4}\/\d{1,2}\/\d{1,2}/;
const timeRegexp = /\d{1,2}:\d{1,2}/;
const talkRegexp = /(\d{1,2}:\d{1,2})\t(.*)\t(.*)/;

const parsedArgs = parse(Deno.args);

const path = String(parsedArgs._[0]);
const filename = basename(path).replace(/\.[0-9a-zA-Z]+$/, "");
const results: TalkData[] = [];

const lines = Deno.readTextFileSync(path)
  .split("\n")
  .slice(2)
  .filter((e) => e !== "")
  .map((e) => e.replace(/[\r\n]|\(emoji\)/g, ""));

let date = "";
let time = "";
let username = "";
let message = "";

for (const line of lines) {
  // 日付を抽出
  if (dateRegexp.test(line)) {
    date = line.replace(/\(.?\)/, "");
    continue;
  }

  // トーク履歴を分割
  const splited = line.match(talkRegexp);

  if (splited) {
    // 追加
    if (isMessage(message)) {
      results.push({
        date: `${date} ${time}`,
        username,
        message,
      });
    }

    time = splited[1];

    username = splited[2];
    message = splited[3];
  } else if (!timeRegexp.test(line)) {
    // 複数行をまとめる
    message += ` ${line}`;
  }
}

Deno.writeTextFileSync(
  `./${filename}.json`,
  JSON.stringify(results, null, "\t")
);

function isMessage(text: string) {
  text = text.trim();
  if (text === "") return false;

  const ignoreList = [
    /^\[写真\]/,
    /^\[動画\]/,
    /^\[スタンプ\]/,
    /^\[ファイル\]/,
    /^\[イベント/,
    /^\[ボイスメッセージ\]/,
    /^通話時間 d{1,2},d{1,2}/,
  ];

  for (const ignore of ignoreList) {
    if (ignore.test(text)) return false;
  }

  return true;
}

function convTime(time: string) {
  // if (/^午[前後]/.test(time)) {
  //   time =
  // }

  return time;
}
