"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import arrowTurnDownLeft from '../../../../public/assets/svgs/hero/ArrowTurnDownLeft.svg';
import Image from 'next/image';
import { useState } from "react"


const formSchema = z.object({
    name: z.string()
        .min(2, { message: "enter a name" })
        .max(50)
        .nonempty({ message: "name is required" }),
    email: z.string()
        .email({ message: "enter a valid email address" })
        .nonempty({ message: "email is required" }),
    message: z.string()
        .min(10, { message: 'no spam please. how can i help?' })
        .max(500)
        .nonempty({ message: "message is required" }),
});

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true)
            setSubmitStatus({ type: null, message: '' });
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            })

            if (!response.ok) {
                throw new Error('Failed to submit form')
            }

            form.reset()
            setSubmitStatus({
                type: 'success',
                message: `Message sent successfully! I'll get back to you ASAP.`
            });
        } catch (error) {
            console.error('Error submitting form:', error)
            setSubmitStatus({
                type: 'error',
                message: 'Failed to send message. Please try again.'
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div id='contact' className='bg-zinc-950 h-auto w-screen pt-16 pb-16 px-4 lg:px-8 flex flex-col gap-0 lg:gap-8'>
            <div className='w-full flex flex-row justify-center'>
                <h1 className='scroll-m-20 text-6xl font-extralight tracking-tight 2xl:text-8xl text-white/20'>contact</h1>
            </div>
            <div className="w-full flex flex-row justify-center">
                <div className="w-full lg:w-[75%] 2xl:w-[50%]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="rounded-2xl pt-8 flex flex-col gap-2 2xl:gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name" 
                                                    type='text' 
                                                    placeholder="your name" 
                                                    className="bg-zinc-950 placeholder:text-gray-400 border border-gray-400 text-zinc-100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                no alias
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    id="email"
                                                    type='email' 
                                                    placeholder="your@emailor.whatever" 
                                                    className="bg-zinc-950 placeholder:text-gray-400 border border-gray-400 text-zinc-100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                a real one
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">message</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="what do you want to chat about?" 
                                                    id='message-2'
                                                    className="bg-zinc-950 min-h-[15rem] placeholder:text-gray-400 border border-gray-400 text-zinc-100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                csis/cia is watching
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='w-full flex flex-col items-center gap-4'>
                                    <Button type="submit" variant={'secondary'} disabled={isSubmitting}>
                                        <b>{isSubmitting ? 'Sending...' : 'Submit'}</b>
                                        <Image priority src={arrowTurnDownLeft} alt='arrow-turn-down-left' className='h-5 w-5'/>
                                    </Button>
                                    {submitStatus.type && (
                                        <p className={`text-sm ${
                                            submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {submitStatus.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}




