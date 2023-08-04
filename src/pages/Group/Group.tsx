import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLessonInGroup,
  createGroups,
  deleteGroups,
  deleteLessonFromGroup,
  fetchGroups,
  updateGroupsInStore,
} from "../../reducer/groupSlice";
import { AppDispatch, RootState } from "store/store";
import styles from "./Group.module.scss";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { fetchLessons } from "../../reducer/lessonSlice";

interface Group {
  _id: string;
  name: string;
  users: any[];
  lessons: any[];
}

const Group = () => {
  const groups = useSelector((state: RootState) => state.groups.groups);
  const lessons = useSelector((state: RootState) => state.lessons.lessons);
  console.log(lessons);

  const dispatch = useDispatch<AppDispatch>();

  const [groupName, setGroupName] = useState<string>("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddLessonToGroup = (groupId: string, lessonId: string) => {
    dispatch(addLessonInGroup({ groupId, lessonId }));
  };

  const handleDeleteLessonFromGroup = (groupId: string, lessonId: string) => {
    dispatch(deleteLessonFromGroup({ groupId, lessonId }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleAddGroup = () => {
    if (groupName.trim() === "") {
      return;
    }
    dispatch(createGroups(groupName));
    setGroupName("");
  };

  const handleEditGroup = (groupId: string) => {
    if (editingGroupName.trim() !== "") {
      dispatch(
        updateGroupsInStore({ groupId, updatedGroupName: editingGroupName })
      );
    }
    setEditingGroupId(null);
  };

  const handleStartEditing = (groupId: string, groupName: string) => {
    setEditingGroupId(groupId);
    setEditingGroupName(groupName);
  };

  const handleDeleteGroup = (groupId: string) => {
    dispatch(deleteGroups(groupId));
  };

  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchLessons());
  }, []);

  return (
    <>
      <div className={styles.input_group}>
        <div className={styles.left}>
          <div className={styles.input_group}>
            <input
              placeholder="Создать группу..."
              value={groupName}
              type="text"
              onChange={handleInputChange}
            />
            <button className={styles.btn_add_group} onClick={handleAddGroup}>
              Создать группу
            </button>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {groups.map((item) => {
          const isEditing = editingGroupId === item._id;
          return (
            <div className={styles.card} key={item._id}>
              <div>
                <div className={styles.edit_name}>
                  {isEditing ? (
                    <div
                      className={styles.btn_check_mark}
                      onClick={() => handleEditGroup(item._id)}
                    >
                      ✓
                    </div>
                  ) : (
                    <div
                      className={styles.btn_redaction_mark}
                      onClick={() => handleStartEditing(item._id, item.name)}
                    >
                      ✏️
                    </div>
                  )}
                  <div className={styles.end_name}>
                    {isEditing ? (
                      <input
                        className={styles.edit_input}
                        type="text"
                        value={editingGroupName}
                        onChange={(e) => {
                          setEditingGroupName(e.target.value);
                        }}
                      />
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </div>
                  <span
                    onClick={() => handleDeleteGroup(item._id)}
                    className={styles.delete_group}
                  >
                    X
                  </span>
                </div>
                <div className={styles.main_lesson_user}>
                  <div>
                    <button>
                      {" "}
                      <Link to={"/users"}>Студенты</Link>
                    </button>
                  </div>
                  <div>
                    <button onClick={handleOpenModal}>Предметы</button>
                  </div>
                  {showModal && (
                    <Modal
                      title="Добавление предмета"
                      open={true}
                      onOk={handleCloseModal}
                      onCancel={handleCloseModal}
                      maskStyle={{ backgroundColor: " #00000025" }}
                    >
                      <div>
                        {lessons.map((lesson) => {
                          return (
                            <div key={lesson._id}>
                              {lesson.title}
                              <button
                                onClick={() =>
                                  handleAddLessonToGroup(item._id, lesson._id)
                                }
                              >
                                +
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteLessonFromGroup(
                                    item._id,
                                    lesson._id
                                  )
                                }
                              >
                                x
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </Modal>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Group;
