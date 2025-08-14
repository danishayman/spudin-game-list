import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <main className="flex min-h-screen flex-col bg-slate-900 text-white pt-0">
            {/* Hero Section */}
            <div className="relative h-[40vh] w-full">
                <Image
                    src="/landing/banner.jpg"
                    alt="About Spudin's Game List"
                    fill
                    priority
                    className="object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900" />

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                        About Spudin&apos;s Game List
                    </h1>
                    <p className="text-xl md:text-2xl max-w-2xl mb-8 drop-shadow-md">
                        Our mission, team, and the technology behind the platform
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto py-16 px-4">
                {/* Our Mission */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-purple-400">Our Mission</h2>
                    <div className="bg-slate-800 p-8 rounded-lg">
                        <p className="text-lg text-slate-200 mb-4">
                            Spudin&apos;s Game List was created with a simple goal: to help gamers track, discover, and share their gaming experiences in one centralized platform.
                        </p>
                        <p className="text-lg text-slate-200">
                            We believe that gaming is more than just a hobby—it&apos;s a passion that brings people together. Our platform aims to foster a community where gamers can connect, discover new titles, and share their thoughts on the games they love.
                        </p>
                    </div>
                </section>

                {/* Features */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-purple-400">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Track Your Games</CardTitle>
                                <CardDescription className="text-slate-300">
                                    Organize your gaming library
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">
                                    Keep a personal collection of games you&apos;ve played, are currently playing, or want to play in the future.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Discover New Games</CardTitle>
                                <CardDescription className="text-slate-300">
                                    Explore trending titles
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">
                                    Find trending and popular games across all platforms and genres, powered by comprehensive game data.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Share Your Reviews</CardTitle>
                                <CardDescription className="text-slate-300">
                                    Express your opinions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300">
                                    Write reviews and share your gaming experiences with the community to help others discover great games.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Tech Stack */}
                {/* <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-purple-400">Our Technology</h2>
                    <div className="bg-slate-800 p-8 rounded-lg">
                        <p className="text-lg text-slate-200 mb-6">
                            Spudin's Game List is built with modern web technologies to provide a fast, responsive, and reliable experience:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-700 p-4 rounded-lg text-center">
                                <h3 className="font-bold mb-2">Next.js</h3>
                                <p className="text-sm text-slate-300">React framework for server-side rendering</p>
                            </div>
                            <div className="bg-slate-700 p-4 rounded-lg text-center">
                                <h3 className="font-bold mb-2">Supabase</h3>
                                <p className="text-sm text-slate-300">Backend database and authentication</p>
                            </div>
                            <div className="bg-slate-700 p-4 rounded-lg text-center">
                                <h3 className="font-bold mb-2">Tailwind CSS</h3>
                                <p className="text-sm text-slate-300">Utility-first CSS framework</p>
                            </div>
                            <div className="bg-slate-700 p-4 rounded-lg text-center">
                                <h3 className="font-bold mb-2">RAWG API</h3>
                                <p className="text-sm text-slate-300">Comprehensive game data</p>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* Team */}
                {/* <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-purple-400">The Team</h2>
                    <div className="bg-slate-800 p-8 rounded-lg">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative w-40 h-40 rounded-full overflow-hidden">
                                <Image
                                    src="/landing/review.png"
                                    alt="Developer"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Spudin</h3>
                                <p className="text-lg text-slate-200 mb-4">Founder & Lead Developer</p>
                                <p className="text-slate-300">
                                    A passionate gamer and developer who created this platform to help fellow gamers track and share their gaming experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* Contact */}
                <section>
                    <h2 className="text-3xl font-bold mb-6 text-purple-400">Get In Touch</h2>
                    <div className="bg-slate-800 p-8 rounded-lg">
                        <p className="text-lg text-slate-200 mb-6">
                            Have questions, suggestions, or feedback? We&apos;d love to hear from you!
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-700 p-6 rounded-lg">
                                <h3 className="font-bold text-xl mb-3">Contact Us</h3>
                                <p className="text-slate-300 mb-2">
                                    <span className="font-semibold">Email:</span> zagreusaiman@gmail.com
                                </p>
                            </div>
                            <div className="bg-slate-700 p-6 rounded-lg">
                                <h3 className="font-bold text-xl mb-3">Follow Us</h3>
                                <div className="flex gap-4">
                                    <a href="https://x.com/zagreusaiman" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </a>
                                    <a href="https://github.com/danishayman" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                        </svg>
                                    </a>
                                    <a href="https://discord.gg/bexed" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
