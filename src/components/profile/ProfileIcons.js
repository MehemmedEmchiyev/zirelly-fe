export function ProfileUserIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M10 10.5C12.0711 10.5 13.75 8.82107 13.75 6.75C13.75 4.67893 12.0711 3 10 3C7.92893 3 6.25 4.67893 6.25 6.75C6.25 8.82107 7.92893 10.5 10 10.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.75 16.5C3.75 13.7386 6.48858 11.5 10 11.5C13.5114 11.5 16.25 13.7386 16.25 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProfileEyeIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.5 10C3.75 6.875 6.25 5 10 5C13.75 5 16.25 6.875 17.5 10C16.25 13.125 13.75 15 10 15C6.25 15 3.75 13.125 2.5 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ProfileCartIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M13.3333 5.00065C13.3333 3.1597 11.8409 1.66732 10 1.66732C8.15905 1.66732 6.66667 3.1597 6.66667 5.00065M5.68297 18.3337H14.3168C16.4038 18.3337 17.9776 16.4378 17.593 14.3864L16.343 7.71979C16.0475 6.14327 14.6709 5.00065 13.0668 5.00065H6.93297C5.32892 5.00065 3.95234 6.14327 3.65673 7.71979L2.40673 14.3864C2.02209 16.4378 3.59584 18.3337 5.68297 18.3337Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileLogoutIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8.33333 3.33337H5.5C4.39543 3.33337 3.5 4.2288 3.5 5.33337V14.6667C3.5 15.7713 4.39543 16.6667 5.5 16.6667H8.33333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.33333 10H16.6667M16.6667 10L13.3333 6.66669M16.6667 10L13.3333 13.3334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileCalendarIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="2.75"
        y="4.75"
        width="14.5"
        height="12.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.75 8.5H17.25M6.5 2.75V5.25M13.5 2.75V5.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
