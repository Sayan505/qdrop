import Link from 'next/link'

export default function Page({ download_link, og_filename, size }) {
    return(
        <a href={download_link}>{og_filename} {size} Bytes</a>
    ); }


export const getServerSideProps = (context) => ({
    props: {
        download_link: context.query.download_link,
        og_filename: context.query.og_filename,
        size: context.query.size
    }
})
