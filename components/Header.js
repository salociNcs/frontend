// components/Header.js
import Link from 'next/link'

const Header = () => {
    return (
        <header className="bg-gray-800 text-white py-4">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link href="/">MyApp</Link>
                </div>
                <ul className="flex space-x-4">
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/services">Services</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
