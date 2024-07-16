import React from 'react'
import Image from 'next/image'
import formatDate from '@/utils/formatDate'

const CardLaporan = ({title, content, image, tanggal_kejadian}) => {
    return (
        <div class="flex flex-col justify-between rounded-lg w-[20rem] h-[17rem] bg-[#ffffff] p-7 shadow-md hover:shadow-lg hover:translate-y-2 duration-75">
            <div>
            <p className="font-bold text-xl mb-2">{title}</p>
            <p className="text-base text-gray-500 text-ellipsis overflow-hidden h-[7.5rem]">{content}</p>
            </div>
            <p className='font-semibold text-sm self-end h-max'>
                {formatDate(tanggal_kejadian)}
            </p>
        </div>
    )
}

export default CardLaporan