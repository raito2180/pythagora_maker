import React from 'react'

export const Footer = () => {
  return (
    <footer className="sm:relative sm:flex sm:justify-between sm:items-center p-2.5 bg-green-400">
      <div className="text-end sm:text-start sm:flex sm:ml-10">
        <div className="mx-1 inline-block sm:block">COPY RIGHT</div>
        <div className="mx-1 inline-block sm:block">プラバシーポリシー</div>
        <div className="mx-1 inline-block sm:block">利用規約</div>
      </div>
      <p className="text-base text-black mb-2 mx-4 hidden sm:block">
        ※本ゲームはPC専用となっております。
      </p>
    </footer>
  )
}
