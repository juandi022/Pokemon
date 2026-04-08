import { useParams } from "react-router";
export const Detail = ()=>{
    const { id } = useParams();
    return (
        <section>
            <h1>Detail Page</h1>
            <p> Pokemon ID:  { id }</p>
        </section>
    )
}

export default Detail;