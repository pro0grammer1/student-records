import { StudentInterface } from "@/db/studentInfo";
import Image from 'next/image';
import { useAuth } from '@/components/AuthContext';

interface CardProps {
    admin: boolean;
    student: StudentInterface;
}

function Card({ admin, student }: CardProps) {
    const { removeStudent} = useAuth();

    const funcDelete = async () => {
        if (!admin) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${student.name}?`
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch('/api/student-info', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roll_no: student.roll_no,
                    classvar: student.class
                })
            });

            const data = await response.json();

            if (data.success) {
                removeStudent(Number(student.roll_no), student.class.toString());

                localStorage.setItem('studentDeleted', Date.now().toString());

                console.log('Student deleted successfully');
            } else {
                alert('Failed to delete student: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student');
        } 
    };

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 relative">
            {admin && (
                <span className="" onClick={() => funcDelete}>
                    <Image height={5} width={5} src='/delete.svg' alt='delete'></Image>
                </span>
            )}

            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-300">
                {student.image ? (
                    <Image
                        src={student.image.toString()}
                        alt={student.name.toString()}
                        width={96}
                        height={96}
                        className="w-full aspect-square"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-2xl font-bold">
                        {student.name.toString().charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">
                    {student.name.toString()}
                </h3>

                <p className="text-sm text-gray-300">
                    Roll No: <span className="font-medium">{student.roll_no.toString()}</span>
                </p>

                <p className="text-sm text-gray-300">
                    Class: <span className="font-medium">{student.class.toString()}</span>
                </p>

                {student.ph_no && (
                    <p className="text-sm text-gray-300">
                        Phone: <span className="font-medium">+91 {student.ph_no.toString()}</span>
                    </p>
                )}
            </div>
        </div>
    );
}

export default Card;