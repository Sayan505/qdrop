import Link from 'next/link'

export default function Page({ download_link, filename }) { return ( <a href={download_link}>{filename}</a>); }


export const getServerSideProps = (context) => ({
    props: {
        download_link: context.query.download_link,
        filename: context.query.filename
    }
})

