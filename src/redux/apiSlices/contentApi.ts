import { api } from "../api/baseApi";

export const CONTENT_TYPES = {
  PRIVACY: "PRIVACY",
  TERMS: "TERMS",
  ABOUT: "ABOUT",
} as const;

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

export interface Rule {
  _id: string;
  type: ContentType;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveRuleRequest {
  type: ContentType;
  content: string;
}

interface RuleResponse {
  success: boolean;
  message: string;
  data: Rule | null;
}

const ruleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRuleByType: builder.query<Rule | null, ContentType>({
      async queryFn(type, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: "/rule",
          method: "GET",
          params: { type },
        });

        if (result.error) {
          if (result.error.status === 404) {
            return { data: null };
          }

          return { error: result.error };
        }

        const response = result.data as RuleResponse;
        return { data: response.data ?? null };
      },
      providesTags: (_result, _error, type) => [{ type: "Rule", id: type }],
    }),
    saveRule: builder.mutation<Rule, SaveRuleRequest>({
      query: (body) => ({
        url: "/rule",
        method: "POST",
        body,
      }),
      transformResponse: (response: RuleResponse) => response.data as Rule,
      invalidatesTags: (_result, _error, { type }) => [{ type: "Rule", id: type }],
    }),
  }),
});

export const { useGetRuleByTypeQuery, useSaveRuleMutation } = ruleApi;
