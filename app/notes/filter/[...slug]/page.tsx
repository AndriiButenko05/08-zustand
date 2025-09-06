import NotesClient from './Notes.client'
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api'

type Props = {
    params: Promise<{ slug: string[] }>
}

async function Notes({ params }: Props) {
    const { slug } = await params
    const tag = slug[0] === 'All' ? undefined : slug[0]
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ['notes', 1, '', tag],
        queryFn: () => fetchNotes(1, undefined, tag),
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tag} />
        </HydrationBoundary>
    )
}
export default Notes
