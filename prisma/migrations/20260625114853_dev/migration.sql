-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "rollNumber" TEXT,
    "class" TEXT NOT NULL,
    "enrollment_Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fees" BOOLEAN,
    "fatherName" TEXT,
    "motherName" TEXT,
    "section" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT,
    "parentPhone" TEXT,
    "address" TEXT,
    "bio" TEXT,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" TEXT NOT NULL,
    "employmentId" TEXT,
    "nic" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assgin_class" TEXT,
    "subjectProficiency" JSONB,
    "section" TEXT,
    "dob" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "bio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "employmentId" TEXT,
    "nic" TEXT,
    "hireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dob" TIMESTAMP(3),
    "department" TEXT,
    "designation" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "bio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_rollNumber_key" ON "student"("rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_employmentId_key" ON "teacher"("employmentId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_nic_key" ON "teacher"("nic");

-- CreateIndex
CREATE UNIQUE INDEX "staff_employmentId_key" ON "staff"("employmentId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_nic_key" ON "staff"("nic");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
