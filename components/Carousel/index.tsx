import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Carousel } from '../../utils/types/types';

interface Props {
    carousel: Carousel[];
}

const CarouselElement: NextPage<Props> = ({carousel}) => {
    const [ inter, setInter ] = useState<NodeJS.Timer>();
    const [ counter, setCounter ] = useState<number>(0);

    useEffect(() => {
        setInter(
            setInterval(() => {
                const el = document.getElementById('carousel');
                console.log(el?.scrollLeft);
		
            }, 1500)
        );
        return () => {
            if (inter !== null && inter !== undefined) {
                clearInterval(inter);
            }
        };
    }, []);

    return (
        <div className='flex flex-col justify-center flex-grow w-11/12 mx-auto my-auto'>
            <div className='relative overflow-hidden shadow-xl rounded-xl bg-pink-200/20 md:shadow-lg'>
                <div className='relative w-full md:h-[60vh] h-[40vh] flex gap-5 snap-mandatory snap-x overflow-x-auto md:py-2' id='carousel'>
                    <div className='md:pr-[23vw]'></div>
                    {
                        carousel.map((item) => <div key={item.id} className="relative w-5/6 h-full overflow-hidden rounded-lg snap-center snap-always shrink-0 first:pl-8 last:pr-8 md:w-3/6" id={item.id}>
                            <Image
                                layout='fill'
                                objectFit='contain'
                                alt='Promocion'
                                className='h-full shrink-0' 
                                placeholder='blur'
                                priority={true}
                                blurDataURL={item.blur}
                                src={item.image}/>
                        </div>

                        )
                    }
                    <div className='md:pr-[23vw]'></div>
                </div>
            </div>   
        </div>

    );

};
export default CarouselElement;
