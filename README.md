# WalletWise Admin

WalletWise Admin is the internal operations dashboard for managing WalletWise
users, administrators, partners, events, tickets, transactions, earnings, KYC,
support requests, roles, permissions, and service configuration.

The application is built with Next.js and communicates with the WalletWise
admin API through an authenticated Axios client.

## Technology stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- TanStack Query for server state and request caching
- TanStack Table for data tables
- Redux Toolkit for shared client state
- Axios for API requests
- Radix UI-based components
- Framer Motion for transitions
- Sonner for notifications
- Vitest and Testing Library

## Requirements

- Node.js 20 or newer
- npm
- Access to the WalletWise admin API
- A valid admin account

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root:

   ```dotenv
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_BACKEND_BASE_URL=https://your-api.example.com/api/v1
   NEXT_PUBLIC_BACKEND_BASE_URL_SOCKET=https://your-api.example.com
   NEXT_PUBLIC_COOKIE_DOMAIN=
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

Do not commit real access tokens, private API hosts, or production-only
credentials.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Public URL used for application metadata. |
| `NEXT_PUBLIC_BACKEND_BASE_URL` | Base URL for REST requests. It should include `/api/v1` when required by the backend. |
| `NEXT_PUBLIC_BACKEND_BASE_URL_SOCKET` | Base host used by real-time notification connections. |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | Optional shared cookie domain for deployed environments. |

Authenticated requests read the `walletwiseToken` cookie and send it as a
Bearer token through the Axios request interceptor in
`src/lib/axiosInstance.ts`.

## Available commands

```bash
npm run dev       # Start the local development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run ESLint
npm run test      # Run Vitest
npx tsc --noEmit  # Run TypeScript checks without emitting files
```

Before opening a pull request, run:

```bash
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

## Project structure

```text
src/
├── app/                 # App Router pages and route layouts
├── components/
│   ├── atoms/           # Small reusable UI elements
│   ├── molecules/       # Composed controls and table utilities
│   ├── organisms/       # Larger feature-independent sections
│   ├── templates/       # Page and dashboard layouts
│   └── ui/              # Radix/shadcn-style primitives
├── features/
│   ├── auth/            # Login, verification, and password workflows
│   ├── partners/        # Partner accounts and partner event summaries
│   ├── services/        # Events and financial/service operations
│   ├── tickets/         # Support ticket management
│   └── users/           # Users, admins, referrals, and related records
├── lib/
│   ├── api/             # Shared API functions
│   ├── constants/       # Shared constants
│   ├── helpers/         # Formatting, cookies, errors, and sockets
│   ├── hooks/           # Shared state and request hooks
│   └── types/           # Shared TypeScript contracts
├── store/               # Redux store, provider, and slices
└── styles/              # Global styles
```

Feature folders generally use the following structure:

```text
features/<feature>/
├── api/          # Axios request functions
├── components/   # Feature UI
├── constants/    # Feature constants
├── helpers/      # Feature transformations
├── hooks/        # React Query and UI-state hooks
└── types/        # Feature contracts
```

## Application areas

### Authentication and access

The application supports login, account verification, forgotten-password and
reset-password flows. Protected routes are checked by `src/middleware.ts`.
Role and permission management is available through the Roles and Manage Admin
sections.

### Users and partners

Administrators can inspect users, transactions, referrals, disputes, cards,
sessions, and activity. Partner management supports account creation, status
changes, deletion, partner details, and partner-created events. The Partners
page provides a general **Create Partner Event** action, while each partner row
provides a preselected creation action for that specific partner.

### Events and tickets

The Events section provides:

- Paginated event listing and search
- Partner event creation and event editing
- Full event details and ticket configuration
- Partner- and admin-created event response normalization
- Event approval and decline workflows
- Event deletion
- Event attendees
- Paginated ticket records
- Admin ticket validation

Event actions behave according to the current event status:

| Current status | Available status actions |
| --- | --- |
| `Pending` | Approve and Decline |
| `Approved` | Decline |
| `Declined` | Approve |

Every event action menu also provides View, Edit, and Delete. Event names link
directly to `/services/events/info/:eventId`. Event IDs, partner names and IDs,
and attendee names and user tags also link to their corresponding event,
partner, or user information pages.

#### Creating an event for a partner

Partner events are created at `/services/events/create`. The partner selector
is the first field and loads its options from `GET /partner`, displaying a
skeleton while the partner list is loading. Opening the form from a partner row
adds `?partnerId=:partnerId` and preselects that partner.

The form supports:

- Concert, beauty pageant, sports, conference, religion, and other categories
- Required square thumbnail and optional event-page banner images
- Live thumbnail and event-page previews
- Editable ticket tier names, prices, and capacities
- Optional headliners with images
- Beauty-pageant prizes and contestant registration fields
- Event schedule, venue, service fee, and refund policy

Submission uses `multipart/form-data` and sends the selected partner as
`partner_id` to `POST /partner-event`. Structured values such as ticket types,
headliners, prizes, and form settings are JSON encoded within the multipart
request. After a successful creation, the admin is redirected to the all-events
page at `/services/events`.

The event information query accepts both supported ticket representations:

- Object-based ticket types used by existing admin events
- Array-based `{ type, price, capacity }` ticket types used by partner events

Array-based values are normalized at the API boundary before being consumed by
the event card and edit workflow.

Important event API operations include:

```text
GET    /events
GET    /events/:eventId
PATCH  /events/:eventId
DELETE /events/:eventId
GET    /events/:eventId/attendees
POST   /partner-event
GET    /partner/:eventId/tickets
PATCH  /partner/events/:eventId
POST   /partner/validate-ticket
```

The configured Axios base URL supplies `/api/v1`; request functions should not
repeat that prefix.

Ticket validation sends:

```json
{
  "ticketId": "WALL-3900953"
}
```

Successful event and ticket mutations invalidate their relevant TanStack Query
caches so tables and detail views refresh.

### Transactions and services

The dashboard includes transaction and configuration views for airtime, data,
electricity, cable, education, betting, transfers, savings, gift cards, virtual
cards, event services, commissions, and earnings.

### Operations

Additional areas include KYC review, notifications, support tickets, analytics,
security settings, user tags, profile management, and role/permission
administration.

## Data-fetching conventions

- Put HTTP calls in the relevant `api` module.
- Use feature hooks to connect requests to TanStack Query.
- Include filters, page, limit, and identifiers in query keys.
- Use `enabled` when a request depends on an identifier.
- Normalize inconsistent backend shapes at the API or query-selection boundary.
- Invalidate every affected list and detail query after a mutation.
- Allow Axios errors to reject naturally unless the request layer adds useful
  context or transformation.
- Present API errors through `promiseErrorFunction` and Sonner.

## Tables and pagination

Reusable tables are built around `TableWrapper`, TanStack Table, and
`PaginationComponent`. Server-driven lists should:

- Send the current page and limit to the API.
- Read pagination metadata from the response.
- Reset to page one when changing the page size or filters.
- Keep row actions in a dedicated action-cell component.
- Avoid columns based on inconsistent record structures.

## UI conventions

- Reuse components from `src/components` before creating feature-specific
  alternatives.
- Use `DynamicTabs` for the standard tab/toggle presentation.
- Support light and dark themes.
- Show skeleton loaders while primary data is loading.
- Confirm destructive operations and state-changing administrative actions.
- Use `StatusBubble` for consistent status presentation.

## Adding a feature

1. Add or update the feature contract in its `types` folder.
2. Implement the API request in the feature `api` module.
3. Wrap it with a TanStack Query hook.
4. Build the UI from existing atoms, molecules, tables, and layouts.
5. Add the App Router page under `src/app`.
6. Invalidate affected query keys after mutations.
7. Add tests for reusable logic and critical interactions.
8. Run lint, tests, TypeScript, and a production build.

## Deployment

Create a production build with:

```bash
npm run build
```

Deploy the generated Next.js application to the chosen hosting platform and set
all required environment variables there. Ensure the frontend origin is allowed
by the backend and that cookie-domain and HTTPS settings match the deployment
environment.

## Troubleshooting

### Requests return 401 or 403

Confirm that the admin is signed in, the `walletwiseToken` cookie exists, and
the account has the required permissions.

### Requests use an incorrect URL

Check `NEXT_PUBLIC_BACKEND_BASE_URL`. It should match the backend base path
expected by the Axios request functions, normally ending in `/api/v1`.

### Tables do not refresh after a mutation

Verify that the mutation invalidates the same query-key prefix used by the list
or detail hook.

### Images do not render

Confirm that the remote image host is permitted in `next.config` and that the
API returned a valid image URL.

### Browser and server output differ

Check for browser-only APIs in server components and ensure interactive
components include the `"use client"` directive.

## USD accounts and savings management

New routes:

| Route | Purpose |
| --- | --- |
| `/manage-usd-kyc` | USD onboarding metrics, search, document review, source of funds, approval/rejection and Miden resync. |
| `/services/usd-accounts` | USD transaction ledger (default), rates/fees, and USD KYC navigation. |
| `/services/usd-accounts/transactions` | Settlement ledger, rail/status filters, failed-provider diagnostics; accepts `?userId=…`. |
| `/services/usd-accounts/settings` | Live base rate, buy/sell spreads, USD fees and returned audit log. |

The existing `/services/savings` page now includes **Active Plans**, **Interest
Rates & Rules**, and **Interest Accrual & Audit** alongside transaction history.
Plan details include contributions and schedule. Manual payouts require maturity
eligibility; emergency liquidation requires a reason. CSV and Excel exports fetch
all pages matching the current accrual filters, not only the visible page.

### API integration contract

This repository implements the frontend. The dashboard backend must implement
these endpoints relative to `NEXT_PUBLIC_BACKEND_BASE_URL`:

```text
GET  /usd/wallets                      # USD KYC listing
GET  /usd/wallets/:id                  # USD KYC details
PATCH /usd/wallets/:id/status         { action: approve | reject, reason? }
PATCH /usd/wallets/:id/freeze         { action: freeze | unfreeze, reason? }
GET  /usd/accounts
GET  /usd/accounts/:userId
PATCH /usd/accounts/:userId/status    { status: active | frozen | suspended }
GET  /usd/transactions
GET  /usd/rates
PUT  /usd/rates
GET  /savings/rates
PUT  /savings/rates
GET  /savings/plans
GET  /savings/plans/:id
POST /savings/plans/:id/payout
POST /savings/plans/:id/force-liquidate { reason }
GET  /savings/accruals
```

The USD ledger uses the supplied `/usd/transactions` response contract. The PRD
does not specify an accrual endpoint path; `/savings/accruals` is proposed here.
Verify these contracts with the backend before production use.

Responses use `{ data: ... }`. Lists accept `page`, `limit`, `search`, `status`,
`rail`, `planType`, and `userId` as appropriate. List data contains `records`
(or `accounts`, `submissions`, `transactions`, `plans`, or `logs`),
`pagination: { total_pages, total_count }`, and optional `metrics`.
Detail and rate responses contain an object in `data`.

UI fields use camelCase:

- Common user: `user: { id, name, email }`; USD rows require `userId` or `user_id`.
- KYC: `submittedAt`, `idCountry`, `status`, `midenCustomerId`,
  `providerKycStatus`, `documents: { idFront, idBack, proofOfAddress }`,
  `sourceOfFunds: { employmentStatus, expectedMonthlyInflow, primaryPurpose, occupation }`.
  Metrics: `pendingReview`, `approvedToday`, `rejected`, `totalCustomers`.
- Accounts: `balance`, `accountNumber`, `routingNumber`, `bankName`, `createdAt`,
  `midenCustomerId`, `midenWalletId`, `cryptoDepositAddress`, `beneficiaries`.
  Metrics: `totalBalance`, `activeAccounts`, `monthlyInflow`, `monthlyOutflow`,
  `activationFees` (NGN).
- USD ledger: numeric `id`, `transaction_id` (displayed transaction reference),
  `first_name`, `last_name`, `email`, `user_tag`, `photo_url`, `amount`, `fee`,
  `commission`, `type`, `category`, `balance`, `date`, `status`, and `details`.
  Provider fees come from `details.provider_fee`; missing fees remain unavailable.
  Pagination uses `totalRecords`, `currentPage`, `totalPages`, and `limit`.
  Summary uses `totalTransactions`, `totalVolumeIn`, `totalVolumeOut`, `totalFees`,
  and `totalCommission`. The resource adapter preserves the raw record and details
  while adapting user identity, provider fee, transaction reference, and date for UI.
  Failed transactions may additionally supply `providerError` or `provider_error`.
- Plans: `id`, `title`, `planType`, `principal`, `interestAccrued`, `payoutAmount`,
  `startDate`, `maturityDate`, `status`, `payoutEligible`, `contributions`, `schedule`.
- Accrual logs: `date`, `planType`, `accountsCount`, `interestCalculated`,
  `interestCredited`, `status`.
- USD rates use the API's snake_case keys: `buy_rate`, `sell_rate`, `buy_fee`,
  `creation_fee`, `monthly_fee`, `ach_fee`, `wire_fee`, `swift_fee`,
  `internal_transfer_fee`, `network_transfer_fee`, `ngn_transfer_fee`, and matching
  `provider_…` keys, plus `id`, `currency`, and `updated_at`. Customer values are
  editable; provider values are displayed read-only. Updates submit changed
  customer fields using their original snake_case keys. Rate inputs retain four
  decimal places; fee inputs use two. No live-market rate is inferred from these
  stored provider values.
- Savings rates: `flexApy`, `goalApy`, `lock30To60Apy`, `lock61To90Apy`,
  `lock91To180Apy`, `lock181To365Apy`, `earlyLiquidationPenalty`,
  `penaltyMode` (`percentage` or `forfeit_interest`), optional `auditLog`.

The backend owns authorization, Miden synchronization, notifications, audit
persistence, transaction atomicity, restriction enforcement, and duplicate-payout
prevention. No provider secret is needed in the browser. These workflows use the
existing authenticated Axios client and route protection; backend permissions
must be enforced for every read and mutation.

### Architecture and recovery

`src/features/finance` separates contracts, Axios requests, normalization helpers,
query/mutation hooks, and composed UI. Existing buttons, inputs, tables, dialogs,
status atoms, dashboard/service templates, and tab error boundaries are reused.
`DocumentInspector` is a reusable molecule with zoom, rotation, fullscreen and an
original-document link for PDFs. Missing data displays as unavailable rather than
zero. Failed requests show a retry state; render failures use the dashboard and
tab error boundaries. Financial mutations refresh all finance queries and savings
history. Query keys include the resource and filters; requests support cancellation.

USD transaction user names, emails, and tags open `/manage-user/info/:userId`.
When a row omits its user ID, clicking resolves an exact email match through
`GET /users?search=…` and caches the resolved ID. Missing or failed matches show
a retryable notification; transaction IDs are never used as user IDs.

### Shared presentation and persistent tabs

Finance tables place their date column first and reuse `TableDate`, `SearchInput`,
`TableLoader`, and `PaginationComponent`. Dates in financial details and rate
metadata also use the existing date formatter.

`DynamicTabs` persists the selected tab in `?tab=…`, preserves other query
parameters, restores it on refresh, and follows browser back/forward navigation.
Nested virtual-card and transfer tabs use `virtualTab` and `transferType` so they
can coexist with the main tab. Default and invalid tab URLs are canonicalized to
a valid tab. The table-state URL updater preserves tab navigation without
continually overwriting it from stale query state.

USD KYC is now `/manage-usd-kyc`, which has a distinct sidebar path from
`/manage-kyc`. The previous `/manage-kyc/usd` URL redirects to the new route.

The USD KYC listing uses `GET /usd/wallets`, with `page`, `limit`, `status`,
`search`, `startDate`, and `endDate` (`YYYY-MM-DD`). The listing starts at
page 1 with 10 rows and no status parameter (all wallets). Selecting a status
from a summary card fetches that status and resets pagination to page 1. Supported status filters are `pending_kyc`,
`kyc_approved`, `active`, `rejected`, and `frozen`. Search accepts names, emails,
user tags, or Miden customer IDs. KYC details use `GET /usd/wallets/:id`, using the selected wallet row ID
when available. KYC approval/rejection uses `/usd/wallets/:id/status`; freeze/unfreeze uses
`/usd/wallets/:id/freeze`. Requests use the configured API
base URL and existing Bearer-token interceptor; localhost is not hardcoded.

The KYC detail view uses the supplied wallet detail contract: `user.fullName`,
`firstName`, `middleName`, `lastName`, `phoneNumber`, `userTag`, `dob`, and `tier`;
`kycDocuments.govIdImageFront`, `govIdImageBack`, `proofOfAddressDocument`,
`bvnOrTaxId`, and `submittedAt`; `bankDetails` including account/routing numbers,
beneficiary and bank addresses; `cryptoAddress`; and nested `security` fields.
Missing documents and null address/source-of-funds profiles show unavailable
states. A selfie is not inferred from the user's profile photo. Wallet IDs stay
separate from user IDs used for profile links and existing KYC actions.

The USD wallet list adapter maps the supplied flat `first_name`, `last_name`,
`email`, `user_tag`, `phone_number`, Miden identifiers, `created_at`, bank account,
and restriction/threat fields into the table view while preserving original data.
The summary displays `totalAccounts`, `pendingKyc`, `kycApproved`, `active`,
`rejected`, `frozen`, and `totalBalance`. Pagination uses filtered `totalRecords`,
independently of the summary's global account count. The wallet row `id` is used
for KYC details, while profile navigation resolves the user by email.

USD KYC status filtering uses the summary cards: Pending KYC, KYC approved,
Active, Rejected, and Frozen select their corresponding server status, while
Total accounts clears it. Clickable cards provide hover, focus, and selected
states; Total USD balance remains informational. The KYC status dropdown is
removed. Date filtering reuses `DateFilterComponent`, including its presets and
custom calendar, and sends `startDate`/`endDate` in `YYYY-MM-DD` format. It starts
with All dates; Clear filters resets both the status selection and date picker.

The KYC table uses the existing three-dot `ColumnActionDropdown` for Review,
Approve KYC / Decline KYC (pending submissions), and Freeze / Unfreeze actions.
The detail view shares the same `UsdWalletActions` component. Both endpoints use
PATCH and the selected wallet ID. Approval sends `{ action: "approve" }`;
decline sends `{ action: "reject", reason }`; freeze sends `{ action: "freeze",
reason }`; unfreeze sends `{ action: "unfreeze" }`. Every action opens the shared
`ConfirmAction` modal. Decline and freeze require a nonblank textarea reason.
Failed requests retain the modal and reason for retry; successful requests close
it and invalidate the finance queries to refresh the table and details.

The USD service no longer includes an Accounts tab; its default view is the
transaction ledger. An old `?tab=accounts` selection falls back to Transactions.
The overview includes a Total USD revenue card in the same permission gate as
Total revenue and Total profit (`admin_management.read`, `.write`, or `.create`).
The card fetches the unfiltered USD transaction summary only when mounted inside
that permission gate. Revenue uses `summary.totalFees`; inflow uses
`summary.totalVolumeIn` and is labeled separately. Missing values show unavailable,
never a conversion from NGN or a wallet balance. Zero totals display as zero.

### Financial list responsibilities

`FinancialList` composes summary, filters, table, pagination, exports, request
states, and the selected-record detail view. `FinancialFilters` owns draft search
and calendar UI; `constants/listFilters.ts` defines per-resource filter options.
`FinancialTable` renders rows, `FinancialCell` formats values and profile links,
and `FinancialRowActions` selects the appropriate action control.
`FinancialPagination` adapts server pagination to the existing shared component.
`useAccrualExport` manages export requests, errors, and duplicate-click protection;
`AccrualExportActions` presents the export controls. Wallet mutations remain
separate and use PATCH for both `/usd/wallets/:id/status` and
`/usd/wallets/:id/freeze`.

### Component folders and data access

Each finance component lives in `components/<Name>/<Name>.tsx`; any component
tests live beside it as `<Name>.test.tsx`. Shared components added for finance
follow the same folder convention. Imports reference the named component file.
Presentation components use feature hooks; HTTP functions stay in `api/`, query
and mutation orchestration and form workflows stay in `hooks/`, transformations
stay in `helpers/`, and configuration stays in `constants/`.

Examples include `useUsdOverviewCard`, `useUsdWalletActions`,
`useUsdRateSettings`, `useSavingsRateSettings`, `useFinancialDetail`, and
`useUserProfileLink`. ESLint prevents the new component files from importing API
modules, Axios, or TanStack Query directly, and from calling `fetch`. Tests are
excluded so they can mock and verify those boundaries.
