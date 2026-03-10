import { NextRequest, NextResponse } from "next/server";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** GET /api/etherscan?address=0x...  — proxies Etherscan txlist with server-side key */
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  // If no server key, check if the client sent one via header (localStorage fallback)
  const clientKey = req.headers.get("x-api-key") || "";
  const apiKey = ETHERSCAN_API_KEY || clientKey;

  if (!apiKey) {
    return NextResponse.json({ error: "No API key configured" }, { status: 401 });
  }

  const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${encodeURIComponent(address)}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to reach Etherscan" }, { status: 502 });
  }
}

/** GET /api/etherscan?check=1  — returns whether a server-side key is configured */
export async function HEAD() {
  return new NextResponse(null, {
    status: ETHERSCAN_API_KEY ? 200 : 204,
  });
}
