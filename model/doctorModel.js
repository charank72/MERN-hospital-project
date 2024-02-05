const mongoose=require('mongoose')

const doctorSchema=new mongoose.Schema(
  {
    /* 
    i.	Name
ii.	Email
iii.	Mobile
iv.	Password
v.	Image
vi.	Doctor_id
vii.	Department
viii.	Qualification
ix.	Description
x.	Exp
xi.	Address
1.	Clinic name
2.	address
3.	Cityname
4.	Pincode 
 */
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "email already exsists"],
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "mobile number already exsists"],
    },
    image:{
      type:String,
      required:true,
      trim:true
    },
    depatment:{
      type:String,
      required:true,
      trim:true
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  }
)