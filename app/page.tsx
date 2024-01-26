"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Container } from "@radix-ui/themes"
import * as React from "react"

const TOKEN_PRICES_ENDPOINT = ""
const NEW_ADDR = "J2XCpwkuvv9XWkPdR7NZyBhajaXA3nt5RGtCnG3JtYiz"

function tokenPrice(sym: string[]): Promise<TokenPrice> {
  return fetch(
    `https://api.coingecko.com/api/v3/simple/price?include_24hr_change=true&vs_currencies=usd&ids=${
      sym.join(",")
    }`,
  ).then((v) => v.json())
}

type TokenPrice = Record<string, {
  usd: number | null
  usd_24h_change: number | null
}>

// 7XdanWCMkgkwtn7fYvgkhv3bu8cL31QrKQpmhdZ4EfvS
function tokenData(
  publicKey: string,
  offset: number,
  count: number,
): Promise<TokenData> {
  if (offset < 1) throw new Error(`Invalid offset ${offset}; must be gt 0`)
  return fetch(
    `https://api.phantom.app/token-data/?publicKey=${publicKey}&page=${offset}&perPage=${count}`,
  ).then((v) => v.json())
}

type TokenData = {
  perPage: number
  page: 1
  total: number
  records: Token[]
}

type Fungible = Token & { type: "fungible" }
type Collectible = Token & { type: "collectible" }
type Token = {
  mintAddress: string
  tokenAccountAddress: string
  amount: string
  type: "fungible" | "collectible"
  name: string
  symbol: string
  imageUrl: string
}

const PUBLIC_KEY = "7XdanWCMkgkwtn7fYvgkhv3bu8cL31QrKQpmhdZ4EfvS"

export default async function Home() {
  const [n, setN] = React.useState(10)
  const value = await tokenData(PUBLIC_KEY, 1, 20)

  const collectibles: Collectible[] = []
  const fungible: Fungible[] = []

  value.records.forEach((v) => {
    ;(v.type === "collectible" ? collectibles : fungible).push(v as never)
  })

  const prices = await tokenPrice(fungible.map(({ symbol }) => symbol))

  // TODO: sorting value.records.sort(({}) => {})

  const price = fungible.reduce((acc, cur) => {
    const tokenPrice = prices[cur.symbol.toLowerCase()]
    if (!tokenPrice?.usd) return acc
    const value = parseInt(cur.amount) * tokenPrice.usd
    return value + acc
  }, 0)

  return (
    <main className="bg-slate-900 mt-2">
      <div>
        <span>${price}</span>
      </div>
      <div className="px-4">
        {value.records.slice(0, n).map(({ name, amount, imageUrl, symbol }) => {
          if (!symbol) return
          const tokenPrice = prices[symbol.toLowerCase()]
          return (
            <TokenCard
              key={name}
              price={tokenPrice?.usd ?? undefined}
              changeInPast24h={tokenPrice?.usd_24h_change ?? undefined}
              {...{ name, amount, imageUrl, symbol }}
            />
          )
        })}
      </div>
    </main>
  )
}

function TokenCard(props: CardProps) {
  return (
    <div className="bg-slate-800 flex flex-row flex-1 p-4 mt-4 rounded-md">
      <div className="flex">
        {props.imageUrl
          ? <img className="w-16 h-16 rounded-full" src={props.imageUrl} />
          : <span>{props.name.charAt(0)}</span>}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-row justify-between">
          <span className="text-white">{props.name}</span>
          <span className="text-white">{"AMOUNT"}</span>
        </div>
        {props.price && (
          <div className="flex flex-1 flex-row justify-between">
            <span className="text-white">{props.price} {props.symbol ?? ""}</span>
            {props.changeInPast24h && <span className="text-white">{props.changeInPast24h}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

interface CardProps {
  name: string
  imageUrl?: string
  amount: string
  price?: number
  changeInPast24h?: number
  symbol?: string
}
