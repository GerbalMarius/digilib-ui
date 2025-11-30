
interface SpinnerProps {
    inline?: boolean;
}

const Spinner = ({ inline = false }: SpinnerProps) => {
    return inline ? (
        <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </span>
    ) : (
        <div className="min-h-screen flex items-center justify-center bg-amber-50">
            <div className="h-10 w-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

}

export default Spinner;