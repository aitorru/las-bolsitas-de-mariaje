import { NextPage } from 'next';
import Image from 'next/image';
import { Carousel } from '../../utils/types/types';

interface Props {
    carousel: Carousel[];
}

const CarouselElement: NextPage<Props> = ({carousel}) => {
    return (
        <div className='flex flex-col justify-center flex-grow w-11/12 mx-auto my-auto'>
            <div className='relative overflow-hidden shadow-xl rounded-xl bg-gray-200/20 md:shadow-lg'>
                <div className='relative w-full md:h-[60vh] h-[40vh] flex gap-5 snap-mandatory snap-x overflow-x-auto md:py-2'>
                    <div className='md:pr-[23vw]'></div>
                    {
                        carousel.map((item) => <div key={item.id} className="relative w-5/6 h-full overflow-hidden rounded-lg snap-center snap-always shrink-0 first:pl-8 last:pr-8 md:w-3/6">
                            <Image
                                layout='fill'
                                objectFit='contain'
                                alt='Promocion'
                                className='h-full shrink-0' 
                                placeholder='blur'
                                blurDataURL={item.blur}
                                src={item.imageUrl == undefined ? '' : item.imageUrl}/>
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
