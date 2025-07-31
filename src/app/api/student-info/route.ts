import { auth } from '@/app/auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/db/connect';
import { Student } from '@/db/studentInfo';

export async function GET() {

  try {
    await connectDB();

    const students = await Student.find({}).lean();

    return NextResponse.json({
      success: true,
      count: students.length,
      students: students
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { roll_no, name, classvar, ph_no, image } = body;

    if (!roll_no || typeof roll_no !== 'number') {
      return NextResponse.json({
        error: 'Not a valid Roll number'
      }, { status: 400 });
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json({
        error: 'Not a valid Name'
      }, { status: 400 });
    }

    if (!classvar || typeof classvar !== 'string') {
      return NextResponse.json({
        error: 'Not a valid Class Name'
      }, { status: 400 });
    }

    await connectDB();

    const existingStudent = await Student.findOne({ roll_no: roll_no, class: classvar });
    if (existingStudent) {
      return NextResponse.json({
        error: 'This student already exists'
      }, { status: 400 });
    }

    const newStudent = await Student.create({
      roll_no: roll_no,
      name: name,
      class: classvar,
      ph_no: ph_no || null,
      image: image || null
    });

    return NextResponse.json({
      success: true,
      message: 'Saved successfully!',
      id: newStudent
    });

  } catch (error) {
    console.error('POST /api/app-info error:', error);
    return NextResponse.json({
      error: 'Invalid request'
    }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { roll_no, classvar } = body;

    if (!roll_no || typeof roll_no !== 'number') {
      return NextResponse.json({
        error: 'Not a valid Roll number'
      }, { status: 400 });
    }

    if (!classvar || typeof classvar !== 'string') {
      return NextResponse.json({
        error: 'Not a valid Class Name'
      }, { status: 400 });
    }

    await connectDB();

    const student = await Student.findOneAndDelete({ roll_no: roll_no, class: classvar });
    if (!student) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/student-info error:', error);
    return NextResponse.json({
      error: 'Failed to delete student'
    }, { status: 500 });
  }
}