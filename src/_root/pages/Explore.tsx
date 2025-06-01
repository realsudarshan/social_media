import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import React from 'react'

function Explore() {
    const {
      data: posts,
      isLoading: isPostLoading,
      isError: isErrorPosts,
    } = useGetRecentPosts();
  return (
    <div>Explore</div>
  )
}

export default Explore