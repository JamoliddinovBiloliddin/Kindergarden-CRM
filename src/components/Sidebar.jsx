import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6'
import { GiReceiveMoney } from 'react-icons/gi'
import { GrUserManager } from 'react-icons/gr'
import { ImStatsBars2, ImUsers } from 'react-icons/im'
import { IoSettingsOutline } from 'react-icons/io5'
import { LuBaby } from 'react-icons/lu'
import { MdPhonelink } from 'react-icons/md'
import { PiBuildingApartment } from 'react-icons/pi'
import { RiShirtLine } from 'react-icons/ri'
import { TbLogout } from 'react-icons/tb'
import { Link } from 'react-router'

function Sidebar() {
	return (
		<>
			<div className='relative w-full top-0 left-0  h-full flex'>
				<div className='w-64 h-screen  max-w-md bg-[#0f172a] backdrop-blur-sm border border-white/50 rounded-r-xl shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] text-white justify-center  '>
					<div className='flex items-center gap-4 px-4 pt-5'>
						<h1 className='text-4xl'>
							<GrUserManager />
						</h1>
						<div>
							<h1 className='font-bold text-xl'>Direktor</h1>
							<p className='text-[12px] text-white/80'>Makkayev So'taqo'zi</p>
						</div>
					</div>
					<div className='flex flex-col w-full p-4 gap-1.5'>
						<p className='font-semibold text-[13.5px] text-white/80'>
							Fillialni tanlang:
						</p>
						<select className='text-white bg-white/20 border-2  rounded-[10px] py-2 px-4 flex items-center justify-center border-white/50 font-medium cursor-pointer'>
							<option className='text-black font-medium' id='1'>
								Barcha filliallar
							</option>
							<option className='text-black font-medium' id='2'>
								Markaziy fillial
							</option>
							<option className='text-black font-medium' id='3'>
								Denov fillial
							</option>
						</select>
					</div>

					<div
						className='border-t border-white/25 mt-2 border-b h-[67%] 
	scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent 
	overflow-y-hidden hover:overflow-y-scroll'
					>
						<ul className='p-6 gap-2 flex flex-col text-lg font-semibold cursor-pointer'>
							{/* Dashboard */}
							<li
								className='group relative flex items-center gap-3 text-white/90 
			px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ease-out'
							>
								<span
									className='absolute left-0 top-0 h-full w-[3px] bg-white/0 
				group-hover:bg-white/60 transition-all duration-300 rounded-r-md'
								></span>

								<span
									className='absolute inset-0 bg-white/10 opacity-0 
				group-hover:opacity-100 group-hover:scale-105 
				transition-all duration-300 rounded-md'
								></span>

								<div
									className='relative  z-10 flex items-center gap-3 
				group-hover:translate-x-1 transition-all duration-300'
								>
									<Link to='/dashboard' className='flex gap-3 items-center'>
										<ImStatsBars2 className='text-[24px] text-white' />
										Dashboard
									</Link>
								</div>
							</li>

							{/* Filiallar */}
							<li
								className='group relative flex items-center gap-3 text-white/90 
			px-4 py-2 rounded-md transition-all duration-300 ease-out'
							>
								<span
									className='absolute left-0 top-0 h-full w-[3px] bg-white/0 
				group-hover:bg-white/60 transition-all duration-300 rounded-r-md'
								></span>

								<span
									className='absolute inset-0 bg-white/10 opacity-0 
				group-hover:opacity-100 group-hover:scale-105 
				transition-all duration-300 rounded-md'
								></span>

								<div
									className='relative z-10 flex items-center gap-3 
				group-hover:translate-x-1 transition-all duration-300'
								>
									<Link to='/filial' className='flex gap-3 items-center'>
										{' '}
										<PiBuildingApartment className='text-[24px] text-white' />
										Mening guruhim
									</Link>
								</div>
							</li>

							{/* Bolalar */}
							<li
								className='group relative flex items-center gap-3 text-white/90 
			px-4 py-2 rounded-md transition-all duration-300 ease-out'
							>
								<span
									className='absolute left-0 top-0 h-full w-[3px] bg-white/0 
				group-hover:bg-white/60 transition-all duration-300 rounded-r-md'
								></span>
								<span
									className='absolute inset-0 bg-white/10 opacity-0 
				group-hover:opacity-100 group-hover:scale-105 
				transition-all duration-300 rounded-md'
								></span>

								<div
									className='relative z-10 flex items-center gap-3 
				group-hover:translate-x-1 transition-all duration-300'
								>
									<Link to='/childrens' className='flex gap-3 items-center'>
										<LuBaby className='text-[24px] text-white' />
										Davomat
									</Link>
								</div>
							</li>

							{/* Guruhlar */}
							<li
								className='group relative flex items-center gap-3 text-white/90 
			px-4 py-2 rounded-md transition-all duration-300 ease-out'
							>
								<span
									className='absolute left-0 top-0 h-full w-[3px] bg-white/0 
				group-hover:bg-white/60 transition-all duration-300 rounded-r-md'
								></span>

								<span
									className='absolute inset-0 bg-white/10 opacity-0 
				group-hover:opacity-100 group-hover:scale-105 
				transition-all duration-300 rounded-md'
								></span>

								<div
									className='relative z-10 flex items-center gap-3 
				group-hover:translate-x-1 transition-all duration-300'
								>
									<Link to='/group' className='flex gap-3 items-center'>
										{' '}
										<ImUsers className='text-[24px] text-white' />
										Oylik hisobot
									</Link>
								</div>
							</li>

							{/* Xodimlar */}
							<li
								className='group relative flex items-center gap-3 text-white/90 
			px-4 py-2 rounded-md transition-all duration-300 ease-out'
							>
								<span
									className='absolute left-0 top-0 h-full w-[3px] bg-white/0 
				group-hover:bg-white/60 transition-all duration-300 rounded-r-md'
								></span>

								<span
									className='absolute inset-0 bg-white/10 opacity-0 
				group-hover:opacity-100 group-hover:scale-105 
				transition-all duration-300 rounded-md'
								></span>

								<div
									className='relative z-10 flex items-center gap-3 
				group-hover:translate-x-1 transition-all duration-300'
								>
									<Link to='/customers' className='flex gap-3 items-center'>
										<RiShirtLine className='text-[24px] text-white' />
										Dars jadvali
									</Link>
								</div>
							</li>

							{/* Moliya */}
							<li
								className='group relative flex items-center gap-3 text-white/90 
			px-4 py-2 rounded-md transition-all duration-300 ease-out'
							>
								<span
									className='absolute left-0 top-0 h-full w-[3px] bg-white/0 
				group-hover:bg-white/60 transition-all duration-300 rounded-r-md'
								></span>

								<span
									className='absolute inset-0 bg-white/10 opacity-0 
				group-hover:opacity-100 group-hover:scale-105 
				transition-all duration-300 rounded-md'
								></span>

								<div
									className='relative z-10 flex items-center gap-3 
				group-hover:translate-x-1 transition-all duration-300'
								>
									<Link to='/industry' className='flex gap-3 items-center'>
										<GiReceiveMoney className='text-[24px] text-white' />
										Xabarlar
									</Link>
								</div>
							</li>


						</ul>
					</div>

					<div className=' py-2 px-4'>
						<button className='flex bg-[#ef4444] w-full py-2 px-4 justify-center items-center gap-[5px] rounded-lg  font-semibold text-[18px] cursor-pointer hover:scale-105 transition-all hover:shadow-md hover:shadow-white/20  h-[50px]'>
							<TbLogout className='flex items-center' /> Chiqish
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default Sidebar
