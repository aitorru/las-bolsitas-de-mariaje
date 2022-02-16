import { NextPage } from 'next';
import Image from 'next/image';
import { Carousel } from '../../utils/types/types';

interface Props {
    carousel: Carousel[];
}

const CarouselElement: NextPage<Props> = ({carousel}) => {
    return (
        <div className='w-11/12 mx-auto my-auto flex-grow flex flex-col justify-center'>
            <div className='relative rounded-xl overflow-hidden bg-pink-200/20 shadow-xl md:shadow-lg'>
                <div className='relative w-full md:h-[60vh] h-[40vh] flex gap-5 snap-mandatory snap-x overflow-x-auto md:py-2'>
                    <div className='md:pr-[23vw]'></div>
                    {
                        carousel.map((item) => <div key={item.id} className="snap-center snap-always shrink-0 first:pl-8 last:pr-8 rounded-lg overflow-hidden h-full w-5/6 md:w-3/6 relative">
                            <Image
                                layout='fill'
                                objectFit='contain'
                                alt='Promocion'
                                className='shrink-0 h-full' 
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
