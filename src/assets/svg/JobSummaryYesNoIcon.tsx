import * as React from 'react';

function SummaryYesNoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.096.864h3.024c1.344 0 2.4 1.104 2.4 2.4v10.272c0 1.344-1.056 2.4-2.4 2.4h-3.024a.963.963 0 0 1-.96-.96v-.096l-1.776.864a7.692 7.692 0 0 0-3.744 4.032l-.912 2.304c-.384.864-1.2 1.44-2.112 1.44-1.296 0-2.304-1.056-2.304-2.352V19.2c0-1.776.576-3.552 1.632-4.992H2.496c-1.104 0-2.016-.912-2.016-2.064 0-.768.432-1.488 1.152-1.92-.288-.384-.48-.864-.48-1.344 0-.864.528-1.632 1.296-1.92-.288-.336-.432-.768-.432-1.248 0-.864.528-1.632 1.296-1.92-.288-.336-.432-.768-.432-1.248C2.88 1.392 3.792.48 4.896.48h5.088c1.903 0 3.277.361 4.922.793.679.179 1.403.369 2.23.551 0-.528.432-.96.96-.96zM10.704 19.44c.816-1.968 2.304-3.6 4.224-4.512l2.208-1.104V2.832c-.993-.222-1.812-.44-2.545-.635-1.64-.436-2.848-.757-4.607-.757H4.896c-.576 0-1.056.48-1.056 1.104 0 .624.48 1.152 1.104 1.2h2.16c.288 0 .48.192.48.48s-.192.48-.48.48H4.08c-.576 0-1.056.48-1.056 1.104 0 .624.48 1.104 1.056 1.104h2.16c.288 0 .48.192.48.48s-.192.48-.48.48H3.216c-.576 0-1.056.48-1.056 1.104 0 .624.48 1.104 1.056 1.104h2.112c.288 0 .48.192.48.48s-.192.48-.48.48H2.496c-.576 0-1.056.48-1.056 1.104 0 .624.48 1.104 1.056 1.104h6.336c.384 0 .624.432.384.768l-.528.72c-.912 1.296-1.44 2.88-1.44 4.464v1.968c0 .768.624 1.392 1.344 1.392.528 0 1.008-.336 1.2-.816l.912-2.304z"
        fill="#C29004"
      />
    </svg>
  );
}

const yesNoIcon = React.memo(SummaryYesNoIcon);
export default yesNoIcon;