// components/NFTButton.js
import React from 'react';
import styles from '@styles/Signup.module.css';

const NFTButton = () => {
  const handleMintNFT = async () => {
    const response = await fetch('/api/mint-nft', {
      method: 'POST',
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <button className={styles.button} onClick={handleMintNFT}>
      Mint NFT
    </button>
  );
};

export default NFTButton;
