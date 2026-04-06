import { createConfig, http } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';
import { Attribution } from 'ox/erc8021';

const BUILDER_CODE = 'bc_hxdiqjk1';

const dataSuffix = Attribution.toDataSuffix({
  builder: BUILDER_CODE as `0x${string}`,
});

export const config = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
  ...(dataSuffix && { dataSuffix }),
});