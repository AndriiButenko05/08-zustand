import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import NotePageClient from './NoteDetails.client'
import { getNoteById } from '@/lib/api'

type Props = {
    params: Promise<{ id: string }>
}

export default async function NotePage({ params }: Props) {
    const { id } = await params
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ['notes', id],
        queryFn: () => getNoteById(id),
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotePageClient id={id} />
        </HydrationBoundary>
    )
}
