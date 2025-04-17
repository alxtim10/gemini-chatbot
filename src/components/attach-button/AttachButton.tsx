import { Upload } from 'lucide-react'
import { useRef } from 'react'

const AttachButton = ({ onFileChange }: { onFileChange: (file: File | null) => void }) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        inputRef.current?.click();
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            onFileChange(e.target.files[0]);
        }

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className='relative'>
            <input
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <button
                onClick={handleFileClick}
                className="inline-flex gap-2 hover:bg-[#313131] hover:shadow-md transition-all p-2 items-center rounded-lg text-sm font-medium"
            >
                <Upload
                    size={15}
                    className="text-[#dadada]"
                />
                <h1 className='text-[12px] text-[#dadada]'>Attach Image</h1>
            </button>
        </div>
    )
}

export default AttachButton