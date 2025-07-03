import '../Styles.css'

export default function FileInput({ onChange, triggerRef }) {
    return (
    <>
        <input
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={onChange}
        ref={triggerRef}
        style={{ display: "none" }}
        />
    </>
    ) 
}