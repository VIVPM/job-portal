const express = require("express");
const mongoose = require("mongoose");
const jwtAuth = require("../lib/jwtAuth");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Job = require("../db/Job");
const Application = require("../db/Application");
const Rating = require("../db/Rating");

const router = express.Router();

// To add new job
router.post("/jobs", jwtAuth, (req, res) => {
  const user = req.user;

  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to add jobs",
    });
    return;
  }

  const data = req.body;

  let job = new Job({
    userId: user._id,
    title: data.title,
    maxApplicants: data.maxApplicants,
    maxPositions: data.maxPositions,
    dateOfPosting: data.dateOfPosting,
    deadline: data.deadline,
    skillsets: data.skillsets,
    jobDescription: data.jobDescription,
    jobType: data.jobType,
    location: data.location,
    companyName:data.companyName,
    duration: data.duration,
    salary: data.salary,
    rating: data.rating,
  });

  job
    .save()
    .then(() => {
      res.json({ message: "Job added successfully to the database" });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to get all the jobs [pagination] [for recruiter personal and for everyone]
router.get("/jobs", jwtAuth, (req, res) => {
  let user = req.user;

  let findParams = {};
  let sortParams = {};

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  // const page = parseInt(req.query.page) || 1; // Default to first page
  // const limit = parseInt(req.query.limit) || 20; // Default limit to 10 items
  // const skip = (page - 1) * limit; // Calculate skip value

  // to list down jobs posted by a particular recruiter
  if (user.type === "recruiter" && req.query.myjobs) {
    findParams = {
      ...findParams,
      userId: user._id,
    };
  }

  if (req.query.q) {
    findParams = {
      ...findParams,
      title: {
        $regex: new RegExp(req.query.q, "i"),
      },
    };
  }

  if (req.query.jobType) {
    let jobTypes = [];
    if (Array.isArray(req.query.jobType)) {
      jobTypes = req.query.jobType;
    } else {
      jobTypes = [req.query.jobType];
    }
    console.log(jobTypes);
    findParams = {
      ...findParams,
      jobType: {
        $in: jobTypes,
      },
    };
  }

  if (req.query.location) {
    findParams = {
      ...findParams,
      location: {
        $regex: new RegExp(req.query.location, "i"),
      },
    };
  }

  if (req.query.companyName) {
    findParams = {
      ...findParams,
      companyName: {
        $regex: new RegExp(req.query.companyName, "i"),
      },
    };
  }

  if (req.query.salaryMin && req.query.salaryMax) {
    findParams = {
      ...findParams,
      $and: [
        {
          salary: {
            $gte: parseInt(req.query.salaryMin),
          },
        },
        {
          salary: {
            $lte: parseInt(req.query.salaryMax),
          },
        },
      ],
    };
  } else if (req.query.salaryMin) {
    findParams = {
      ...findParams,
      salary: {
        $gte: parseInt(req.query.salaryMin),
      },
    };
  } else if (req.query.salaryMax) {
    findParams = {
      ...findParams,
      salary: {
        $lte: parseInt(req.query.salaryMax),
      },
    };
  }

  if (req.query.startDate && req.query.endDate) {
    findParams = {
      ...findParams,
      dateOfPosting: {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      },
    };
  } else if (req.query.startDate) {
    findParams = {
      ...findParams,
      dateOfPosting: {
        $gte: new Date(req.query.startDate)
      },
    };
  } else if (req.query.endDate) {
    findParams = {
      ...findParams,
      dateOfPosting: {
        $lte: new Date(req.query.endDate)
      },
    };
  }


  if (req.query.duration) {
    findParams = {
      ...findParams,
      duration: {
        $lt: parseInt(req.query.duration),
      },
    };
  }

  if (req.query.asc) {
    if (Array.isArray(req.query.asc)) {
      req.query.asc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: 1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.asc]: 1,
      };
    }
  }

  if (req.query.desc) {
    if (Array.isArray(req.query.desc)) {
      req.query.desc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: -1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.desc]: -1,
      };
    }
  }

  console.log(findParams);
  console.log(sortParams);

  // Job.find(findParams).collation({ locale: "en" }).sort(sortParams);
  // .skip(skip)
  // .limit(limit)

  let arr = [
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "userId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    { $match: findParams },
  ];

  if (Object.keys(sortParams).length > 0) {
    arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
      {
        $sort: sortParams,
      },
    ];
  }

  // arr.push({ $skip: skip });
  // arr.push({ $limit: limit});

  console.log(arr);

  Job.aggregate(arr)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "No job found",
        });
        return;
      }
      res.json(posts);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to get info about a particular job
router.get("/jobs/:id", jwtAuth, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id });
    if (!job) {
      return res.status(400).json({ message: "Job does not exist" });
    }
    res.json(job);
  } catch (err) {
    res.status(400).json(err);
  }
});


// to update info of a particular job
router.put("/jobs/:id", jwtAuth, async (req, res) => {
  const user = req.user;
  if (user.type !== "recruiter") {
    return res.status(401).json({
      message: "You don't have permissions to change the job details",
    });
  }
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: user.id });
    if (!job) {
      return res.status(404).json({ message: "Job does not exist" });
    }
    const { maxApplicants, maxPositions, deadline } = req.body;
    if (maxApplicants) job.maxApplicants = maxApplicants;
    if (maxPositions) job.maxPositions = maxPositions;
    if (deadline) job.deadline = deadline;

    await job.save();
    res.json({ message: "Job details updated successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// to delete a job
router.delete("/jobs/:id", jwtAuth, async (req, res) => {
  const user = req.user;
  if (user.type !== "recruiter") {
    return res.status(401).json({
      message: "You don't have permissions to delete the job",
    });
  }
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: user.id });
    if (!job) {
      return res.status(401).json({
        message: "You don't have permissions to delete the job",
      });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// get user's personal details
// router.get("/user", jwtAuth, (req, res) => {
//   const user = req.user;
//   if (user.type === "recruiter") {
//     Recruiter.findOne({ userId: user._id })
//       .then((recruiter) => {
//         if (recruiter == null) {
//           res.status(404).json({
//             message: "User does not exist",
//           });
//           return;
//         }
//         res.json(recruiter);
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   } else {
//     JobApplicant.findOne({ userId: user._id })
//       .then((jobApplicant) => {
//         if (jobApplicant == null) {
//           res.status(404).json({
//             message: "User does not exist",
//           });
//           return;
//         }
//         res.json(jobApplicant);
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   }
// });

// get user details from id
// router.get("/user/:id", jwtAuth, (req, res) => {
//   User.findOne({ _id: req.params.id })
//     .then((userData) => {
//       if (userData === null) {
//         res.status(404).json({
//           message: "User does not exist",
//         });
//         return;
//       }

//       if (userData.type === "recruiter") {
//         Recruiter.findOne({ userId: userData._id })
//           .then((recruiter) => {
//             if (recruiter === null) {
//               res.status(404).json({
//                 message: "User does not exist",
//               });
//               return;
//             }
//             res.json(recruiter);
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       } else {
//         JobApplicant.findOne({ userId: userData._id })
//           .then((jobApplicant) => {
//             if (jobApplicant === null) {
//               res.status(404).json({
//                 message: "User does not exist",
//               });
//               return;
//             }
//             res.json(jobApplicant);
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

// router.get("/user/:id", jwtAuth, (req, res) => {
//   User.findOne({ _id: req.params.id })
//     .then((userData) => {
//       if (userData === null) {
//         res.status(404).json({
//           message: "User does not exist",
//         });
//         return;
//       }

//       const userInfo = {
//         email: userData.email,
//         type: userData.type,
//         // Include any other user details you want to send, but exclude sensitive information like passwords
//       };

//       if (userData.type === "recruiter") {
//         Recruiter.findOne({ userId: userData._id })
//           .then((recruiter) => {
//             if (recruiter === null) {
//               res.status(404).json({
//                 message: "Recruiter profile does not exist",
//               });
//               return;
//             }
//             // Merge user info with recruiter details and send the combined data
//             const response = {
//               ...userInfo,
//               ...recruiter.toObject(), // Convert the Mongoose document to a plain JavaScript object
//             };
//             res.json(response);
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       } else {
//         JobApplicant.findOne({ userId: userData._id })
//           .then((jobApplicant) => {
//             if (jobApplicant === null) {
//               res.status(404).json({
//                 message: "Job applicant profile does not exist",
//               });
//               return;
//             }
//             // Merge user info with job applicant details and send the combined data
//             const response = {
//               ...userInfo,
//               ...jobApplicant.toObject(), // Convert the Mongoose document to a plain JavaScript object
//             };
//             res.json(response);
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

// Helper function to fetch and merge user details
async function fetchAndMergeUserDetails(userId, callback) {
  try {
    const userData = await User.findOne({ _id: userId });
    if (!userData) {
      return callback({ message: "User does not exist" }, null);
    }

    const userInfo = { email: userData.email, type: userData.type };
    const profileModel = userData.type === "recruiter" ? Recruiter : JobApplicant;

    const profile = await profileModel.findOne({ userId: userData._id });
    if (!profile) {
      return callback(
        { message: `${userData.type} profile does not exist` },
        null
      );
    }

    const mergedDetails = { ...userInfo, ...profile.toObject() };
    callback(null, mergedDetails);
  } catch (err) {
    callback(err, null);
  }
}

// Route to get user details by user ID
router.get("/user/:id", jwtAuth, (req, res) => {
  fetchAndMergeUserDetails(req.params.id, (err, userDetails) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.json(userDetails);
    }
  });
});

// Route to get the authenticated user's details
router.get("/user", jwtAuth, (req, res) => {
  // Assuming req.user._id contains the authenticated user's ID
  fetchAndMergeUserDetails(req.user._id, (err, userDetails) => {
    if (err) {
      res.status(404).json(err);
    } else {
      console.log("GET", userDetails)
      res.json(userDetails);
    }
  });
});


// update user details
// router.put("/user", jwtAuth, (req, res) => {
//   const user = req.user;
//   const data = req.body;
//   // console.log(data)
//   if (user.type == "recruiter") {
//     Recruiter.findOne({ userId: user._id })
//       .then((recruiter) => {
//         if (recruiter == null) {
//           res.status(404).json({
//             message: "User does not exist",
//           });
//           return;
//         }
//         if (data.name) {
//           recruiter.name = data.name;
//         }
//         if(data.email){
//           recruiter.email = data.email
//         }
//         if (data.contactNumber) {
//           recruiter.contactNumber = data.contactNumber;
//         }
//         if (data.profile) {
//           recruiter.profile = data.profile;
//         }
//         if (data.Company){
//           recruiter.Company = data.Company
//         }
//         if (data.YearsExperience){
//           recruiter.YearsExperience = data.YearsExperience
//         }
//         if (data.bio) {
//           recruiter.bio = data.bio;
//         }
//         recruiter
//           .save()
//           .then(() => {
//             res.json({
//               message: "User information updated successfully",
//             });
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   } else {
//     JobApplicant.findOne({ userId: user._id })
//       .then((jobApplicant) => {
//         if (jobApplicant == null) {
//           res.status(404).json({
//             message: "User does not exist",
//           });
//           return;
//         }
//         if (data.name) {
//           jobApplicant.name = data.name;
//         }
//         if (data.email){
//           console.log("yes")
//           jobApplicant.email = data.email
//         }
//         // if (data.contactNumber) {
//         //   jobApplicant.contactNumber = data.contactNumber;
//         // }
//         if (data.education) {
//           jobApplicant.education = data.education;
//         }
//         if (data.skills) {
//           jobApplicant.skills = data.skills;
//         }
//         if (data.resume) {
//           jobApplicant.resume = data.resume;
//         }
//         if (data.profile) {
//           jobApplicant.profile = data.profile;
//         }
//         console.log(jobApplicant.email);
//         jobApplicant
//           .save()
//           .then(() => {
//             console.log("Heavy")
//             res.json({
//               message: "User information updated successfully",
//             });
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   }
// });


router.put("/user", jwtAuth, async (req, res) => {
  const user = req.user;
  const data = req.body;

  try {
    // Update the User model with the new email
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { email: data.email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Determine the appropriate profile model
    const profileModel = user.type === "recruiter" ? Recruiter : JobApplicant;

    // Prepare updates for the profile model
    const updates = { name: data.name };

    if (user.type === "recruiter") {
      // Recruiter-specific updates
      if (data.contactNumber) updates.contactNumber = data.contactNumber;
      if (data.Company) updates.Company = data.Company;
      if (data.YearsExperience) updates.YearsExperience = data.YearsExperience;
      if (data.bio) updates.bio = data.bio;
      if (data.profile) updates.profile = data.profile;
    } else {
      // Job applicant-specific updates
      if (data.contactNumber) updates.contactNumber = data.contactNumber;
      if (data.education) updates.education = data.education;
      if (data.skills) updates.skills = data.skills;
      if (data.resume) updates.resume = data.resume;
      if (data.profile) updates.profile = data.profile;
    }

    // Update the appropriate profile model
    await profileModel.findOneAndUpdate({ userId: user._id }, updates, { new: true });

    res.json({ message: "User information updated successfully" });
  } catch (err) {
    console.error("Error updating user information:", err);
    if (err.code === 11000 && err.keyPattern?.email) {
      res.status(400).json({ message: "Email already in use. Please use a different email." });
    } else {
      res.status(400).json(err);
    }
  }
});

// apply for a job [todo: test: done]
router.post("/jobs/:id/applications", jwtAuth, async (req, res) => {
  const user = req.user;
  if (user.type !== "applicant") {
    return res.status(401).json({
      message: "You don't have permissions to apply for a job",
    });
  }
  try {
    const { sop } = req.body;
    const jobId = req.params.id;

    const appliedApplication = await Application.findOne({
      userId: user._id,
      jobId,
      status: { $nin: ["deleted", "accepted", "cancelled"] },
    });
    if (appliedApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const job = await Job.findOne({ _id: jobId });
    if (!job) {
      return res.status(404).json({ message: "Job does not exist" });
    }

    const activeApplicationCount = await Application.countDocuments({
      jobId,
      status: { $nin: ["rejected", "deleted", "cancelled", "finished"] },
    });

    if (activeApplicationCount >= job.maxApplicants) {
      return res.status(400).json({ message: "Application limit reached" });
    }

    const myActiveApplicationCount = await Application.countDocuments({
      userId: user._id,
      status: { $nin: ["rejected", "deleted", "cancelled", "finished"] },
    });

    if (myActiveApplicationCount >= 10) {
      return res.status(400).json({
        message: "You have 10 active applications. Hence you cannot apply.",
      });
    }

    const acceptedJobs = await Application.countDocuments({
      userId: user._id,
      status: "accepted",
    });

    if (acceptedJobs > 0) {
      return res.status(400).json({
        message: "You already have an accepted job. Hence you cannot apply.",
      });
    }

    const application = new Application({
      userId: user._id,
      recruiterId: job.userId,
      jobId: job._id,
      status: "applied",
      sop,
    });

    await application.save();
    res.json({ message: "Job application successful" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// recruiter gets applications for a particular job [pagination] [todo: test: done]
router.get("/jobs/:id/applications", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to view job applications",
    });
    return;
  }
  const jobId = req.params.id;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  let findParams = {
    jobId: jobId,
    recruiterId: user._id,
  };

  let sortParams = {};

  if (req.query.status) {
    findParams = {
      ...findParams,
      status: req.query.status,
    };
  }

  Application.find(findParams)
    .collation({ locale: "en" })
    .sort(sortParams)
    // .skip(skip)
    // .limit(limit)
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// recruiter/applicant gets all his applications [pagination]
router.get("/applications", jwtAuth, (req, res) => {
  const user = req.user;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  Application.aggregate([
    {
      $lookup: {
        from: "jobapplicantinfos",
        localField: "userId",
        foreignField: "userId",
        as: "jobApplicant",
      },
    },
    { $unwind: "$jobApplicant" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "recruiterId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    {
      $match: {
        [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
      },
    },
    {
      $sort: {
        dateOfApplication: -1,
      },
    },
  ])
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update status of application: [Applicant: Can cancel, Recruiter: Can do everything] [todo: test: done]
router.put("/applications/:id", jwtAuth, async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const status = req.body.status;

  try {
    if (user.type === "recruiter") {
      if (status === "accepted") {
        const application = await Application.findOne({ _id: id, recruiterId: user._id });

        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }

        const job = await Job.findOne({ _id: application.jobId, userId: user._id });
        if (!job) {
          return res.status(404).json({ message: "Job does not exist" });
        }

        const activeApplicationCount = await Application.countDocuments({
          recruiterId: user._id,
          jobId: job._id,
          status: "accepted",
        });

        if (activeApplicationCount < job.maxPositions) {
          application.status = status;
          application.dateOfJoining = req.body.dateOfJoining;
          await application.save();

          await Application.updateMany(
            {
              _id: { $ne: application._id },
              userId: application.userId,
              status: { $nin: ["rejected", "deleted", "cancelled", "accepted", "finished"] },
            },
            { $set: { status: "cancelled" } }
          );

          if (status === "accepted") {
            await Job.findOneAndUpdate(
              { _id: job._id, userId: user._id },
              { $set: { acceptedCandidates: activeApplicationCount + 1 } }
            );
          }

          return res.json({ message: `Application ${status} successfully` });
        } else {
          return res.status(400).json({ message: "All positions for this job are already filled" });
        }
      } else {
        const application = await Application.findOneAndUpdate(
          {
            _id: id,
            recruiterId: user._id,
            status: { $nin: ["rejected", "deleted", "cancelled"] },
          },
          { $set: { status } },
          { new: true }
        );

        if (!application) {
          return res.status(400).json({ message: "Application status cannot be updated" });
        }

        return res.json({ message: `Application ${status} successfully` });
      }
    } else {
      if (status === "cancelled") {
        const application = await Application.findOneAndUpdate(
          { _id: id, userId: user._id },
          { $set: { status } },
          { new: true }
        );

        if (!application) {
          return res.status(400).json({ message: "Application cannot be cancelled" });
        }

        return res.json({ message: `Application ${status} successfully` });
      } else {
        return res.status(401).json({
          message: "You don't have permissions to update job status",
        });
      }
    }
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(400).json(err);
  }
});

// get a list of final applicants for current job : recruiter
// get a list of final applicants for all his jobs : recruiter
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    let findParams = {
      recruiterId: user._id,
    };
    if (req.query.jobId) {
      findParams = {
        ...findParams,
        jobId: new mongoose.Types.ObjectId(req.query.jobId),
      };
    }
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        findParams = {
          ...findParams,
          status: { $in: req.query.status },
        };
      } else {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }
    }
    let sortParams = {};

    if (!req.query.asc && !req.query.desc) {
      sortParams = { _id: 1 };
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    Application.aggregate([
      {
        $lookup: {
          from: "jobapplicantinfos",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: findParams },
      { $sort: sortParams },
    ])
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "No applicants found",
          });
          return;
        }
        res.json(applications);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "You are not allowed to access applicants list",
    });
  }
});

// to add or update a rating [todo: test]

router.put("/rating", jwtAuth, async (req, res) => {
  const user = req.user;
  const data = req.body;

  try {
    if (user.type === "recruiter") {
      // can rate applicant
      let rating = await Rating.findOne({
        senderId: user._id,
        receiverId: new mongoose.Types.ObjectId(data.applicantId),
        category: "applicant"
      });

      if (!rating) {
        const acceptedApplicantCount = await Application.countDocuments({
          userId: data.applicantId,
          recruiterId: user._id,
          status: { $in: ["accepted", "finished"] }
        });

        if (acceptedApplicantCount > 0) {
          rating = new Rating({
            category: "applicant",
            receiverId: new mongoose.Types.ObjectId(data.applicantId),
            senderId: user._id,
            rating: data.rating,
          });
          await rating.save();
        } else {
          return res.status(400).json({
            message: "Applicant didn't work under you. Hence you cannot give a rating.",
          });
        }
      } else {
        rating.rating = data.rating;
        await rating.save();
      }

      const result = await Rating.aggregate([
        {
          $match: {
            receiverId: new mongoose.Types.ObjectId(data.applicantId),
            category: "applicant",
          },
        },
        {
          $group: {
            _id: {},
            average: { $avg: "$rating" },
          },
        },
      ]);

      if (!result[0]) {
        return res.status(400).json({
          message: "Error while calculating rating",
        });
      }

      const avg = result[0].average;

      const applicant = await JobApplicant.findOneAndUpdate(
        { userId: data.applicantId },
        { $set: { rating: avg } },
        { new: true } // Return the updated document
      );

      if (!applicant) {
        return res.status(400).json({
          message: "Error while updating applicant's average rating",
        });
      }

      res.json({ message: "Rating added/updated successfully" });

    } else {
      // applicant can rate job
      let rating = await Rating.findOne({
        senderId: user._id,
        receiverId: new mongoose.Types.ObjectId(data.jobId),
        category: "job"
      });

      if (!rating) {
        const acceptedApplicantCount = await Application.countDocuments({
          userId: user._id,
          jobId: data.jobId,
          status: { $in: ["accepted", "finished"] }
        });

        if (acceptedApplicantCount > 0) {
          rating = new Rating({
            category: "job",
            receiverId: new mongoose.Types.ObjectId(data.jobId),
            senderId: user._id,
            rating: data.rating,
          });
          await rating.save();
        } else {
          return res.status(400).json({
            message: "You haven't worked for this job. Hence you cannot give a rating.",
          });
        }
      } else {
        rating.rating = data.rating;
        await rating.save();
      }

      const result = await Rating.aggregate([
        {
          $match: {
            receiverId: new mongoose.Types.ObjectId(data.jobId),
            category: "job",
          },
        },
        {
          $group: {
            _id: {},
            average: { $avg: "$rating" },
          },
        },
      ]);

      if (!result[0]) {
        return res.status(400).json({
          message: "Error while calculating rating",
        });
      }

      const avg = result[0].average;

      const foundJob = await Job.findOneAndUpdate(
        { _id: data.jobId },
        { $set: { rating: avg } },
        { new: true } // Return the updated document
      );

      if (!foundJob) {
        return res.status(400).json({
          message: "Error while updating job's average rating",
        });
      }

      res.json({ message: "Rating added/updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "An error occurred", error: err.message });
  }
});

// get personal rating
router.get("/rating", jwtAuth, async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    const category = user.type === "recruiter" ? "applicant" : "job";

    const rating = await Rating.findOne({
      senderId: user._id,
      receiverId: id,
      category,
    });

    if (!rating) {
      return res.json({ rating: -1 });
    }

    res.json({ rating: rating.rating });
  } catch (err) {
    console.error("Error fetching rating:", err);
    res.status(500).json({ message: "An error occurred while fetching the rating." });
  }
});


// Application.findOne({
//   _id: id,
//   userId: user._id,
// })
//   .then((application) => {
//     application.status = status;
//     application
//       .save()
//       .then(() => {
//         res.json({
//           message: `Application ${status} successfully`,
//         });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   })
//   .catch((err) => {
//     res.status(400).json(err);
//   });

// router.get("/jobs", (req, res, next) => {
//   passport.authenticate("jwt", { session: false }, function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       res.status(401).json(info);
//       return;
//     }
//   })(req, res, next);
// });

module.exports = router;
