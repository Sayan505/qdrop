import Link from 'next/link'

export default function Home() {
    return(
        <form method="POST" action="/api/upload" enctype="multipart/form-data">
            <input type="file" name="target_file" />
            <input type="submit" />
        </form>
    ); }
