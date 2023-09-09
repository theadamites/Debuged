import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(null)

  const fetchAll = useCallback(async () => {
    if (paginatedTransactions === null) {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
        "paginatedTransactions",
        {
          page: 0, // Always start from the first page
        }
      )
      
      setPaginatedTransactions(response)
    } else if (paginatedTransactions.nextPage !== null) {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
        "paginatedTransactions",
        {
          page: paginatedTransactions?.nextPage,
        }
      )

      setPaginatedTransactions((previousResponse) => {
        if (response === null || previousResponse === null) {
          return response
        }

        return {
          data: [...previousResponse.data, ...response.data], // Append new data to existing data
          nextPage: response.nextPage,
          
        }
      })
    }
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
