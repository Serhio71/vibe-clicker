'use client';

import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';

const CONTRACT_ADDRESS = '0x17Ce38B8A73e2967B2B4F458dafaA5FaD5c02590';

export default function VibeClicker() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  const [vibes, setVibes] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  // Получаем баланс
  const { data: currentVibes, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: [
      {
        inputs: [{ internalType: "address", name: "player", type: "address" }],
        name: "getCurrentVibes",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: 'getCurrentVibes',
    args: [address!],
    query: { enabled: !!address },
  });

  useEffect(() => {
    if (currentVibes !== undefined) {
      setVibes(Number(currentVibes));
    }
  }, [currentVibes]);

  // Автообновление баланса каждые 800мс
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(refetch, 800);
    return () => clearInterval(interval);
  }, [isConnected, refetch]);

  const handleClick = async () => {
    setIsClicking(true);
    await writeContract({
      address: CONTRACT_ADDRESS,
      abi: [{ inputs: [], name: "click", outputs: [], stateMutability: "nonpayable", type: "function" }],
      functionName: 'click',
    });
    setTimeout(() => setIsClicking(false), 300);
  };

  const buyAutoViber = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: [{ inputs: [], name: "buyAutoViber", outputs: [], stateMutability: "nonpayable", type: "function" }],
      functionName: 'buyAutoViber',
    });
  };

  const buyMultiplier = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: [{ inputs: [], name: "buyMultiplier", outputs: [], stateMutability: "nonpayable", type: "function" }],
      functionName: 'buyMultiplier',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <div className="text-8xl mb-6">🌟</div>
        <h1 className="text-7xl font-black tracking-tighter">VIBE CLICKER</h1>
      </div>

      <ConnectButton />

      {isConnected ? (
        <div className="mt-10 w-full max-w-md text-center">
          {/* Баланс */}
          <div className="mb-14">
            <div className="text-7xl font-mono font-bold text-yellow-300 tracking-tighter">
              {Math.floor(vibes).toLocaleString()}
            </div>
            <p className="text-3xl text-yellow-200">VIBES</p>
          </div>

          {/* Шар */}
          <div 
            onClick={handleClick}
            className={`w-[390px] h-[390px] mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-[160px] shadow-2xl cursor-pointer border-8 border-white/70 transition-all ${isClicking ? 'scale-90' : 'hover:scale-105'}`}
          >
            ✨
          </div>

          <p className="mt-6 text-lg opacity-80">Кликни по шару ✨</p>

          {/* Кнопки апгрейдов */}
          <div className="grid grid-cols-2 gap-5 mt-16">
            <button 
              onClick={buyAutoViber}
              disabled={isPending}
              className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/30 py-7 rounded-3xl text-lg font-medium transition-all active:scale-95"
            >
              Auto Viber<br />
              <span className="text-xs opacity-70">+1 в секунду</span>
            </button>

            <button 
              onClick={buyMultiplier}
              disabled={isPending}
              className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/30 py-7 rounded-3xl text-lg font-medium transition-all active:scale-95"
            >
              Multiplier<br />
              <span className="text-xs opacity-70">Усиливает клик</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-20 text-center">
          <p className="text-4xl mb-6">Добро пожаловать в Vibe Clicker</p>
          <p className="text-2xl opacity-70">Подключи MetaMask на Base Sepolia, чтобы играть</p>
        </div>
      )}
    </div>
  );
}